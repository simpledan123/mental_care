import { useState } from 'react'
import { diaryApi, anomalyApi } from '../api/diary'
import AnomalyAlert from './AnomalyAlert'

const today = () => new Date().toISOString().slice(0, 10)

const MOOD_LABELS = { 1: '매우 나쁨', 2: '나쁨', 3: '보통', 4: '좋음', 5: '매우 좋음' }

export default function DiaryForm({ onSaved }) {
  const [form, setForm] = useState({
    recordDate:     today(),
    wakeTime:       '',
    sleepDuration:  '',
    appliedCompany: '',
    moodScore:      0,
    memo:           '',
  })
  const [anomaly, setAnomaly]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.wakeTime || !form.sleepDuration || form.moodScore === 0) {
      setMessage('기상 시간, 수면 시간, 기분 점수는 필수입니다.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await diaryApi.save({ ...form, sleepDuration: parseFloat(form.sleepDuration) })
      const { data } = await anomalyApi.analyze(form.recordDate)
      setAnomaly(data)
      setMessage('저장되었습니다.')
      onSaved?.()
    } catch {
      setMessage('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AnomalyAlert result={anomaly} />

      <div style={styles.card}>
        <p style={styles.sectionTitle}>기본 정보</p>

        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>날짜</label>
            <input style={styles.input} type="date" value={form.recordDate}
              onChange={e => set('recordDate', e.target.value)} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>기상 시간</label>
            <input style={styles.input} type="time" value={form.wakeTime}
              onChange={e => set('wakeTime', e.target.value)} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>수면 시간 (시간)</label>
            <input style={styles.input} type="number" step="0.5" min="0" max="24"
              placeholder="ex) 7.5" value={form.sleepDuration}
              onChange={e => set('sleepDuration', e.target.value)} />
          </div>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>오늘 지원한 회사</label>
          <input style={styles.input} type="text" placeholder="ex) 카카오, 네이버"
            value={form.appliedCompany}
            onChange={e => set('appliedCompany', e.target.value)} />
        </div>

        <p style={{ ...styles.sectionTitle, marginTop: 28 }}>기분 점수</p>
        <div style={styles.moodRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} style={{
              ...styles.moodBtn,
              borderColor: form.moodScore === n ? '#c8f0a0' : '#2a2a30',
              background:  form.moodScore === n ? '#1a2a14' : '#1e1e22',
              color:       form.moodScore === n ? '#c8f0a0' : '#6b6b78',
            }} onClick={() => set('moodScore', n)}>
              <span style={{ fontSize: 22 }}>
                {['😞','😕','😐','🙂','😊'][n - 1]}
              </span>
              <span style={{ fontSize: 10, display: 'block', marginTop: 4 }}>
                {MOOD_LABELS[n]}
              </span>
            </button>
          ))}
        </div>

        <p style={{ ...styles.sectionTitle, marginTop: 28 }}>한 줄 메모</p>
        <textarea style={{ ...styles.input, resize: 'vertical', minHeight: 72 }}
          placeholder="오늘 하루를 한 줄로 기록해 보세요"
          value={form.memo}
          onChange={e => set('memo', e.target.value)} />

        {message && (
          <p style={{ fontSize: 12, color: '#c8f0a0', marginTop: 12 }}>{message}</p>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button style={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? '저장 중...' : '기록 저장'}
          </button>
          <button style={styles.btnGhost} onClick={() => setForm({
            recordDate: today(), wakeTime: '', sleepDuration: '',
            appliedCompany: '', moodScore: 0, memo: '',
          })}>
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#17171a',
    border: '1px solid #2a2a30',
    borderRadius: 14,
    padding: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#6b6b78',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: '1px solid #2a2a30',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  label: { fontSize: 12, color: '#6b6b78' },
  input: {
    background: '#1e1e22',
    border: '1px solid #2a2a30',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#e8e8ec',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  },
  moodRow: { display: 'flex', gap: 10 },
  moodBtn: {
    flex: 1,
    padding: '10px 6px',
    border: '1px solid',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  btnPrimary: {
    background: '#c8f0a0',
    color: '#0f1a0a',
    border: 'none',
    borderRadius: 8,
    padding: '11px 28px',
    fontSize: 13,
    fontFamily: 'inherit',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnGhost: {
    background: 'none',
    color: '#6b6b78',
    border: '1px solid #2a2a30',
    borderRadius: 8,
    padding: '11px 24px',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
}
