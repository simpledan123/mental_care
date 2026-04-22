# 청년 루틴 케어

취업 준비 중 일상 루틴이 잘 유지되지 않았던 경험에서 출발한 프로젝트.  
기상 시간, 수면 시간, 기분 점수 등 일상 루틴을 기록하고, 이상이 감지되면 알려준다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Spring Boot 3.2, Java 17 |
| 이상 감지 | Apache Commons Math 3 |
| DB | PostgreSQL + MyBatis |
| Frontend | React 18, Vite |

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

## API

| Method | Endpoint | 설명 |
|---|---|---|
| POST | /api/diary | 일기 저장 |
| GET | /api/diary | 전체 조회 |
| GET | /api/diary/{date} | 날짜별 조회 |
| DELETE | /api/diary/{date} | 삭제 |
| GET | /api/anomaly/{date} | 이상 감지 분석 |

## 이상 감지 로직

최근 7일 데이터를 기준으로 기분 점수, 기상 시간, 수면 시간 각각의 Z-score를 계산한다.  
Z-score 절댓값이 2.0을 초과하면 이상으로 판정하고 항목별 메시지를 반환한다.  
데이터가 3일 미만이면 분석을 수행하지 않는다.
