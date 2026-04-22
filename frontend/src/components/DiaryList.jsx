const MOOD_EMOJI = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' }

export default function DiaryList({ diaries, onDelete }) {
  if (!diaries || diaries.length === 0) {
    return (
      <div style={{ color: '#6b6b78', fontSize: 13, padding: '24px 0' }}>
        아직 기록이 없습니다.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {diaries.map(d => (
        <div key={d.id} style={styles.item}>
          <span style={styles.date}>{d.recordDate}</span>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: '#e8e8ec', marginBottom: 4 }}>
              {d.memo || '—'}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag>기상 {d.wakeTime?.slice(0, 5)}</Tag>
              <Tag>수면 {d.sleepDuration}h</Tag>
              {d.appliedCompany && <Tag accent="blue">{d.appliedCompany}</Tag>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 22 }}>{MOOD_EMOJI[d.moodScore]}</span>
            <button style={styles.deleteBtn} onClick={() => onDelete?.(d.recordDate)}>
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Tag({ children, accent }) {
  const colors = {
    blue: { background: '#1a2028', color: '#a0d4f0', border: '1px solid #2a3a48' },
    default: { background: '#1e1e22', color: '#6b6b78', border: '1px solid #2a2a30' },
  }
  return (
    <span style={{ ...styles.tag, ...colors[accent ?? 'default'] }}>
      {children}
    </span>
  )
}

const styles = {
  item: {
    background: '#17171a',
    border: '1px solid #2a2a30',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  date: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6b6b78',
    minWidth: 90,
  },
  tag: {
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '3px 8px',
    borderRadius: 4,
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #2a2a30',
    borderRadius: 6,
    color: '#6b6b78',
    fontSize: 11,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
