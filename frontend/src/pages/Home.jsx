import { useEffect, useState } from 'react'
import { diaryApi } from '../api/diary'

const MOOD_EMOJI = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' }

export default function Home() {
  const [diaries, setDiaries] = useState([])

  useEffect(() => {
    diaryApi.findAll().then(r => setDiaries(r.data)).catch(() => {})
  }, [])

  const recent7 = diaries.slice(0, 7).reverse()
  const avgMood = diaries.length
    ? (diaries.slice(0, 7).reduce((s, d) => s + d.moodScore, 0) / Math.min(diaries.length, 7)).toFixed(1)
    : '—'
  const totalApplied = diaries.filter(d => d.appliedCompany).length

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>대시보드</h1>
          <p style={styles.sub}>나의 루틴 현황</p>
        </div>
        <span style={styles.dateBadge}>{new Date().toISOString().slice(0, 10)}</span>
      </div>

      {/* 요약 카드 */}
      <div style={styles.grid3}>
        <StatCard label="총 기록 수" value={diaries.length} unit="일" color="#c8f0a0" />
        <StatCard label="7일 평균 기분" value={avgMood} color="#a0d4f0" />
        <StatCard label="지원 기록 있는 날" value={totalApplied} unit="일" color="#f0c8a0" />
      </div>

      {/* 기분 그래프 */}
      <div style={styles.card}>
        <p style={styles.cardLabel}>최근 7일 기분 추이</p>
        {recent7.length === 0 ? (
          <p style={{ color: '#6b6b78', fontSize: 13 }}>기록이 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 }}>
            {recent7.map(d => (
              <div key={d.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: '#6b6b78', fontFamily: 'monospace' }}>
                  {MOOD_EMOJI[d.moodScore]}
                </span>
                <div style={{
                  width: '100%',
                  height: d.moodScore * 16,
                  borderRadius: '4px 4px 0 0',
                  background: moodColor(d.moodScore),
                  opacity: 0.85,
                }} />
                <span style={{ fontSize: 10, color: '#6b6b78', fontFamily: 'monospace' }}>
                  {d.recordDate?.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 기록 */}
      <div style={styles.card}>
        <p style={styles.cardLabel}>최근 기록</p>
        {diaries.slice(0, 5).length === 0 ? (
          <p style={{ color: '#6b6b78', fontSize: 13 }}>기록이 없습니다.</p>
        ) : (
          diaries.slice(0, 5).map(d => (
            <div key={d.id} style={styles.row}>
              <span style={styles.rowDate}>{d.recordDate}</span>
              <span style={styles.rowMemo}>{d.memo || '—'}</span>
              <span style={{ fontSize: 18 }}>{MOOD_EMOJI[d.moodScore]}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, color }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 600, color, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 14, color: '#6b6b78', marginLeft: 4 }}>{unit}</span>
      </p>
    </div>
  )
}

function moodColor(score) {
  return ['#f0a0a0', '#f0c8a0', '#a0d4f0', '#c8f0a0', '#a0f0c8'][score - 1]
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 },
  title: { fontSize: 26, fontWeight: 600, letterSpacing: -0.5, color: '#e8e8ec' },
  sub: { fontSize: 13, color: '#6b6b78', marginTop: 4 },
  dateBadge: { fontFamily: 'monospace', fontSize: 12, color: '#6b6b78', background: '#1e1e22', padding: '6px 14px', borderRadius: 20, border: '1px solid #2a2a30' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 },
  statCard: { background: '#17171a', border: '1px solid #2a2a30', borderRadius: 14, padding: 24 },
  card: { background: '#17171a', border: '1px solid #2a2a30', borderRadius: 14, padding: 24, marginBottom: 16 },
  cardLabel: { fontSize: 11, fontFamily: 'monospace', color: '#6b6b78', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  row: { display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid #2a2a30' },
  rowDate: { fontFamily: 'monospace', fontSize: 12, color: '#6b6b78', minWidth: 90 },
  rowMemo: { flex: 1, fontSize: 13, color: '#e8e8ec' },
}
