CREATE TABLE diary (
    id            BIGSERIAL PRIMARY KEY,
    record_date   DATE        NOT NULL UNIQUE,
    wake_time     TIME        NOT NULL,
    sleep_duration NUMERIC(4,1) NOT NULL,  -- 수면 시간 (시간 단위)
    applied_company VARCHAR(255),           -- 오늘 지원한 회사
    mood_score    SMALLINT    NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
    memo          TEXT,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);
