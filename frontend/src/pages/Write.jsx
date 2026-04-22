import DiaryForm from '../components/DiaryForm'

export default function Write() {
  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>오늘 기록</h1>
          <p style={styles.sub}>오늘 하루를 기록해 주세요</p>
        </div>
      </div>
      <DiaryForm />
    </div>
  )
}

const styles = {
  header: { marginBottom: 36 },
  title: { fontSize: 26, fontWeight: 600, letterSpacing: -0.5, color: '#e8e8ec' },
  sub: { fontSize: 13, color: '#6b6b78', marginTop: 4 },
}
