"""
analyze_anomaly.py

backend/src/main/java/com/mentalcare/service/AnomalyService.java 의 이상 감지 로직을
Python(pandas)으로 동일하게 재구현한 스크립트.

- 비교 기준: 직전 최근 7일 (WINDOW = 7)
- 임계값: |Z-score| > 2.0
- 직전 기록이 3일 미만이면 분석하지 않음
- 항목: 기분 점수(mood_score), 기상 시간(wake_minutes), 수면 시간(sleep_duration)

Java 버전과 결과를 비교 검증하기 위해, 동일한 날짜에 대해 동일한 Z-score가 나오는지
별도로 확인할 수 있도록 함수 단위로 분리하여 작성하였다.
"""

import pandas as pd
import numpy as np

from db import load_diary

WINDOW = 7
Z_THRESHOLD = 2.0
MIN_HISTORY = 3

TARGET_COLUMNS = {
    "mood_score": "MOOD",
    "wake_minutes": "WAKE_TIME",
    "sleep_duration": "SLEEP_DURATION",
}


def _zscore(history: pd.Series, target: float) -> float:
    """Java DescriptiveStatistics와 동일하게 표본표준편차(ddof=1)를 사용한다."""
    if len(history) < 2:
        return 0.0
    mean = history.mean()
    std = history.std(ddof=1)
    if std == 0 or np.isnan(std):
        return 0.0
    return (target - mean) / std


def analyze_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    """
    전체 기록에 대해 날짜별로 이상 감지를 수행하고, 결과 컬럼을 추가한 DataFrame을 반환한다.
    Java analyze(LocalDate) 메서드를 모든 날짜에 대해 배치로 수행하는 것과 동일하다.
    """
    df = df.sort_values("record_date").reset_index(drop=True)

    results = []
    for idx, row in df.iterrows():
        history = df.iloc[max(0, idx - WINDOW):idx]  # 직전 최대 7일

        if len(history) < MIN_HISTORY:
            results.append({
                "record_date": row["record_date"],
                "anomaly": False,
                "anomaly_type": "NONE",
                "z_score": 0.0,
                "message": "기록이 충분하지 않아 분석할 수 없습니다. 최소 3일 이상 기록해 주세요.",
            })
            continue

        z_scores = {
            col: _zscore(history[col], row[col]) for col in TARGET_COLUMNS
        }

        anomaly_type = "NONE"
        max_abs_z = 0.0
        for col, label in TARGET_COLUMNS.items():
            if abs(z_scores[col]) > Z_THRESHOLD and abs(z_scores[col]) > max_abs_z:
                max_abs_z = abs(z_scores[col])
                anomaly_type = label

        results.append({
            "record_date": row["record_date"],
            "anomaly": anomaly_type != "NONE",
            "anomaly_type": anomaly_type,
            "z_score": round(max_abs_z, 3),
            "message": _build_message(anomaly_type, row),
        })

    result_df = pd.DataFrame(results)
    return df.merge(result_df, on="record_date", how="left")


def _build_message(anomaly_type: str, row: pd.Series) -> str:
    if anomaly_type == "MOOD":
        return f"최근 기분 점수({row['mood_score']}점)가 평소보다 크게 낮아졌습니다."
    if anomaly_type == "WAKE_TIME":
        return "오늘 기상 시간이 평소와 많이 달라졌습니다."
    if anomaly_type == "SLEEP_DURATION":
        return f"수면 시간({row['sleep_duration']}시간)이 평소와 차이가 있습니다."
    return "오늘 루틴은 안정적입니다."


if __name__ == "__main__":
    diary_df = load_diary()

    if diary_df.empty:
        print("diary 테이블에 데이터가 없습니다.")
    else:
        result = analyze_anomalies(diary_df)
        cols = ["record_date", "mood_score", "sleep_duration", "wake_minutes",
                "anomaly", "anomaly_type", "z_score", "message"]
        print(result[cols].to_string(index=False))

        anomaly_count = result["anomaly"].sum()
        print(f"\n총 {len(result)}건 중 이상 감지: {anomaly_count}건")
