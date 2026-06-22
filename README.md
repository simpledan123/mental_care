# 청년 루틴 케어

취업 준비 중 일상 루틴이 잘 유지되지 않았던 경험에서 출발한 프로젝트.
기상 시간, 수면 시간, 기분 점수 등 일상 루틴을 기록하고, 이상이 감지되면 알려준다.
기록된 데이터를 기반으로 별도의 Python 분석 레이어에서 시각화, 데이터 품질 점검, 추세 추정, 리포트 생성을 수행한다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Spring Boot 3.2, Java 17 |
| 이상 감지 (Backend) | Apache Commons Math 3 |
| DB | PostgreSQL + MyBatis |
| Frontend | React 18, Vite |
| 데이터 분석 (Python) | pandas, SQLAlchemy, matplotlib, openpyxl, scikit-learn |

## 프로젝트 구조

```
mental_care/
├── backend/             Spring Boot API 서버
├── frontend/            React 대시보드
└── python-analysis/      Python 데이터 분석 레이어
    ├── db.py
    ├── analyze_anomaly.py
    ├── visualize_routine.py
    ├── data_quality_check.py
    ├── trend_forecast.py
    ├── generate_report.py
    └── requirements.txt
```

## 실행 방법

### 1. DB 설정

```sql
createdb mentalcare
psql mentalcare < backend/sql/schema.sql
```

### 2. Backend

```bash
cd backend
./gradlew bootRun
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

프론트: http://localhost:5173
백엔드: http://localhost:8080

### 4. Python 분석 레이어

```bash
cd python-analysis
pip install -r requirements.txt

python analyze_anomaly.py
python visualize_routine.py
python data_quality_check.py
python trend_forecast.py
python generate_report.py
```

DB 접속 정보는 python-analysis/db.py 상단의 DB_URL에서 관리하며, 기존 backend/src/main/resources/application.yml과 동일한 값(postgres/postgres/mentalcare/localhost:5432)을 사용한다.

## API

| Method | Endpoint | 설명 |
|---|---|---|
| POST | /api/diary | 일기 저장 |
| GET | /api/diary | 전체 조회 |
| GET | /api/diary/{date} | 날짜별 조회 |
| DELETE | /api/diary/{date} | 삭제 |
| GET | /api/anomaly/{date} | 이상 감지 분석 |

## 이상 감지 로직 (Backend)

최근 7일 데이터를 기준으로 기분 점수, 기상 시간, 수면 시간 각각의 Z-score를 계산한다.
Z-score 절댓값이 2.0을 초과하면 이상으로 판정하고 항목별 메시지를 반환한다.
데이터가 3일 미만이면 분석을 수행하지 않는다.

## Python 분석 레이어

backend의 AnomalyService에 구현된 이상 감지 로직을 Python으로 동일하게 재구현하고, 데이터 분석 관점의 기능을 추가하였다. 기존 backend, frontend와 독립적으로 동작하며, PostgreSQL의 diary 테이블을 직접 읽어 분석한다.

### 구성 파일

| 파일 | 역할 |
|---|---|
| db.py | PostgreSQL 연결 및 diary 테이블 로딩 공통 모듈 |
| analyze_anomaly.py | backend AnomalyService의 Z-score 이상 감지 로직을 pandas로 재구현 |
| visualize_routine.py | 기분, 수면, 기상 시간 추이 및 이상치를 matplotlib으로 시각화 |
| data_quality_check.py | 결측치, 범위 위반, 중복, 기록 공백 등 데이터 품질 점검 |
| trend_forecast.py | 최근 샘플 기준 한 달 수면량 확장 추정 및 기분 점수 추세 예측 |
| generate_report.py | 주간 요약, 이상치 로그, KPI 추이를 Excel 리포트로 출력 |

### backend와의 로직 일치 검증

analyze_anomaly.py는 AnomalyService.java의 로직(직전 7일 비교, Z-score 임계값 2.0, 최소 기록 3일)을 동일하게 재현하였다. Java 버전은 표본표준편차 계산 시 Apache Commons Math3의 DescriptiveStatistics를 사용하므로, Python 쪽에서도 pandas의 std(ddof=1)을 사용하여 동일한 표본표준편차 방식으로 맞추었다. 같은 날짜에 대해 두 구현체의 결과를 비교하면 동일한 Z-score가 산출됨을 확인할 수 있다.

### 데이터 분석 업무 영역과의 대응

- 이상치 탐지 및 데이터 품질 모니터링: analyze_anomaly.py, data_quality_check.py
- 샘플 데이터의 확장 추정(extrapolation): trend_forecast.py의 한 달 수면량 추정 로직
- 분석 결과 리포팅: generate_report.py의 Excel 출력
- 시각화를 통한 인사이트 전달: visualize_routine.py

### 향후 보강 가능 사항

표본 크기가 충분히 누적되면, 단순 선형 회귀 대신 계절성을 반영한 시계열 모델로 확장하는 것을 고려할 수 있다. 데이터 품질 점검 항목에 이상치 자동 정정 로직을 추가하면 점검과 처리를 하나의 파이프라인으로 연결할 수 있다.
