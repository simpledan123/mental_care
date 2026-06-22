"""
data_quality_check.py

diary 테이블에 대한 기본적인 데이터 품질 점검을 수행한다.

점검 항목
1. 결측치 비율 (필수 컬럼 기준)
2. 값의 범위 검증 (수면 시간, 기분 점수, 기상 시간)
3. 날짜 중복 여부 (record_date는 UNIQUE 제약이 있으나, 배치 적재 시점에는 별도 확인 필요)
4. 기록 공백(gap) — 연속 기록이 끊긴 날짜 구간 탐지
"""

import pandas as pd

from db import load_diary

REQUIRED_COLUMNS = ["record_date", "wake_time", "sleep_duration", "mood_score"]

VALID_RANGES = {
    "sleep_duration": (0, 24),
    "mood_score": (1, 5),
}


def check_missing(df: pd.DataFrame) -> pd.DataFrame:
    missing = df[REQUIRED_COLUMNS].isna().sum()
    ratio = (missing / len(df) * 100).round(2)
    return pd.DataFrame({"결측 건수": missing, "결측 비율(%)": ratio})


def check_range_violations(df: pd.DataFrame) -> pd.DataFrame:
    violations = []
    for col, (low, high) in VALID_RANGES.items():
        bad = df[(df[col] < low) | (df[col] > high)]
        for _, row in bad.iterrows():
            violations.append({
                "record_date": row["record_date"],
                "column": col,
                "value": row[col],
                "valid_range": f"{low} ~ {high}",
            })
    return pd.DataFrame(violations)


def check_duplicate_dates(df: pd.DataFrame) -> pd.DataFrame:
    dup = df[df.duplicated("record_date", keep=False)]
    return dup.sort_values("record_date")


def check_date_gaps(df: pd.DataFrame) -> pd.DataFrame:
    """연속된 날짜 사이에 빠진 날짜(기록 공백)를 모두 나열한다."""
    if df.empty:
        return pd.DataFrame(columns=["missing_date"])

    full_range = pd.date_range(df["record_date"].min(), df["record_date"].max(), freq="D")
    existing = set(df["record_date"])
    missing_dates = [d for d in full_range if d not in existing]
    return pd.DataFrame({"missing_date": missing_dates})


def run_all_checks():
    df = load_diary()
    if df.empty:
        print("diary 테이블에 데이터가 없습니다.")
        return

    print("=== 1. 결측치 점검 ===")
    print(check_missing(df))

    print("\n=== 2. 값 범위 위반 ===")
    range_violations = check_range_violations(df)
    print(range_violations if not range_violations.empty else "범위 위반 없음")

    print("\n=== 3. 중복 날짜 ===")
    dup = check_duplicate_dates(df)
    print(dup if not dup.empty else "중복 없음")

    print("\n=== 4. 기록 공백(빠진 날짜) ===")
    gaps = check_date_gaps(df)
    print(f"전체 {len(gaps)}일 공백" if not gaps.empty else "공백 없음")
    if not gaps.empty:
        print(gaps.to_string(index=False))


if __name__ == "__main__":
    run_all_checks()
