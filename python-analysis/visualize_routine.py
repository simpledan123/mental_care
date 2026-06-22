"""
visualize_routine.py

기상 시간, 수면 시간, 기분 점수의 시계열 추이를 시각화하고,
analyze_anomaly.py에서 감지된 이상치를 그래프 위에 표시한다.

출력: routine_trend.png (3개 서브플롯: 기분 / 수면 시간 / 기상 시간)
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from db import load_diary
from analyze_anomaly import analyze_anomalies

OUTPUT_PATH = "routine_trend.png"


def plot_routine(df):
    fig, axes = plt.subplots(3, 1, figsize=(11, 9), sharex=True)

    series_spec = [
        ("mood_score", "MOOD", "기분 점수 (1~5)", axes[0], "#5b9bd5"),
        ("sleep_duration", "SLEEP_DURATION", "수면 시간 (h)", axes[1], "#70ad47"),
        ("wake_minutes", "WAKE_TIME", "기상 시간 (분, 0시 기준)", axes[2], "#ed7d31"),
    ]

    for col, anomaly_label, ylabel, ax, color in series_spec:
        ax.plot(df["record_date"], df[col], marker="o", color=color, linewidth=1.5,
                markersize=4, label=ylabel)

        anomalies = df[(df["anomaly_type"] == anomaly_label)]
        if not anomalies.empty:
            ax.scatter(anomalies["record_date"], anomalies[col],
                       color="red", s=70, zorder=5, label="이상 감지")

        ax.set_ylabel(ylabel, fontsize=10)
        ax.legend(loc="upper left", fontsize=8)
        ax.grid(alpha=0.3)

    axes[-1].xaxis.set_major_formatter(mdates.DateFormatter("%m-%d"))
    fig.autofmt_xdate()
    fig.suptitle("청년 루틴 케어 — 최근 추이 및 이상 감지", fontsize=13)
    fig.tight_layout(rect=[0, 0, 1, 0.97])
    fig.savefig(OUTPUT_PATH, dpi=150)
    print(f"그래프 저장 완료: {OUTPUT_PATH}")


if __name__ == "__main__":
    diary_df = load_diary()
    if diary_df.empty:
        print("diary 테이블에 데이터가 없습니다.")
    else:
        result = analyze_anomalies(diary_df)
        plot_routine(result)
