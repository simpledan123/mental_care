export default function AnomalyAlert({ result }) {
  if (!result || !result.anomaly) return null

  const typeLabel = {
    MOOD:           '기분 점수',
    WAKE_TIME:      '기상 시간',
    SLEEP_DURATION: '수면 시간',
  }

  return (
    <div style={{
      background: '#1a1010',
      border: '1px solid #3a2020',
      borderLeft: '3px solid #f0a0a0',
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 20,
    }}>
      <p style={{ color: '#f0a0a0', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        ⚠ 루틴 이상 감지 — {typeLabel[result.anomalyType] ?? result.anomalyType}
      </p>
      <p style={{ color: '#c0a0a0', fontSize: 13, lineHeight: 1.7 }}>{result.message}</p>
    </div>
  )
}
