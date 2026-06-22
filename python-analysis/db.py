"""
db.py

기존 backend/src/main/resources/application.yml 의 DB 설정과 동일한 값을 사용한다.
PostgreSQL의 diary 테이블을 pandas DataFrame으로 읽어오는 공통 함수를 제공한다.
"""

import pandas as pd
from sqlalchemy import create_engine

DB_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/mentalcare"


def get_engine():
    return create_engine(DB_URL)


def load_diary(engine=None) -> pd.DataFrame:
    """
    diary 테이블 전체를 record_date 기준 오름차순으로 불러온다.
    wake_time은 당일 0시 기준 분(minute) 단위 컬럼(wake_minutes)으로 함께 변환하여 반환한다.
    """
    if engine is None:
        engine = get_engine()

    query = """
        SELECT id, record_date, wake_time, sleep_duration,
               applied_company, mood_score, memo, created_at
        FROM diary
        ORDER BY record_date ASC
    """
    df = pd.read_sql(query, engine)

    if df.empty:
        return df

    df["record_date"] = pd.to_datetime(df["record_date"])
    df["wake_minutes"] = df["wake_time"].apply(
        lambda t: t.hour * 60 + t.minute if pd.notnull(t) else None
    )
    return df


if __name__ == "__main__":
    data = load_diary()
    print(f"불러온 기록 수: {len(data)}건")
    print(data.head())
