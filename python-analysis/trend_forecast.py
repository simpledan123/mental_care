"""
trend_forecast.py

샘플(최근 N일) 데이터를 기준으로 향후 추세를 추정하는 스크립트.
NIQ 공고의 '샘플 데이터를 시장 수준으로 확장(extrapolation)'과 유사한 개념을,
'최근 N일 샘플로 한 달 누적치를 추정'하는 형태로 단순화하여 구현하였다.

1. 수면 누적 추정: 최근 7일 평균 수면 시간을 기준으로 한 달(30일) 예상 총 수면 시간 추정
   - 권장 수면 시간(7시간) 대비 누적 수면 부족/과다 시간도 함께 계산
2. 기분 점수 추세 예측: 선형 회귀로 향후 7일 기분 점수 추세선 추정
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

from db import load_diary

RECOMMENDED_SLEEP_HOURS = 7.0
FORECAST_DAYS = 7
EXTRAPOLATION_DAYS = 30


def estimate_monthly_sleep(df: pd.DataFrame, recent_n: int = 7) -> dict:
    """최근 recent_n일 평균 수면 시간으로 한 달 치 수면량을 확장 추정한다."""
    recent = df.tail(recent_n)
    avg_sleep = recent["sleep_duration"].mean()

    estimated_monthly_sleep = avg_sleep * EXTRAPOLATION_DAYS
    recommended_monthly_sleep = RECOMMENDED_SLEEP_HOURS * EXTRAPOLATION_DAYS
    gap = estimated_monthly_sleep - recommended_monthly_sleep

    return {
        "표본 일수": recent_n,
        "표본 평균 수면 시간(h)": round(avg_sleep, 2),
        f"{EXTRAPOLATION_DAYS}일 확장 추정 총 수면 시간(h)": round(estimated_monthly_sleep, 1),
        f"{EXTRAPOLATION_DAYS}일 권장 총 수면 시간(h)": round(recommended_monthly_sleep, 1),
        "권장 대비 차이(h)": round(gap, 1),
    }


def forecast_mood_trend(df: pd.DataFrame, recent_n: int = 14) -> pd.DataFrame:
    """최근 recent_n일 기분 점수를 선형 회귀로 적합시켜 향후 FORECAST_DAYS일을 예측한다."""
    recent = df.tail(recent_n).reset_index(drop=True)

    x = np.arange(len(recent)).reshape(-1, 1)
    y = recent["mood_score"].values

    model = LinearRegression().fit(x, y)

    future_x = np.arange(len(recent), len(recent) + FORECAST_DAYS).reshape(-1, 1)
    future_pred = model.predict(future_x)
    future_pred = np.clip(future_pred, 1, 5)  # 기분 점수 범위(1~5) 밖으로 나가지 않도록 보정

    last_date = recent["record_date"].max()
    future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=FORECAST_DAYS)

    return pd.DataFrame({
        "record_date": future_dates,
        "predicted_mood_score": future_pred.round(2),
        "trend_slope": round(model.coef_[0], 4),
    })


if __name__ == "__main__":
    diary_df = load_diary()
    if diary_df.empty:
        print("diary 테이블에 데이터가 없습니다.")
    else:
        print("=== 수면 시간 한 달 확장 추정 ===")
        for k, v in estimate_monthly_sleep(diary_df).items():
            print(f"{k}: {v}")

        print("\n=== 향후 7일 기분 점수 추세 예측 ===")
        forecast = forecast_mood_trend(diary_df)
        print(forecast.to_string(index=False))
