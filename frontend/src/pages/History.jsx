import { useEffect, useState } from 'react'
import { diaryApi } from '../api/diary'
import DiaryList from '../components/DiaryList'

export default function History() {
  const [diaries, setDiaries] = useState([])

  const load = () => diaryApi.findAll().then(r => setDiaries(r.data)).catch(() => {})

  useEffect(() => { load() }, [])

  const handleDelete = async (date) => {
    if (!window.confirm(`${date} 기록을 삭제할까요?`)) return
    await diaryApi.remove(date)
    load()
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>기록 내역</h1>
          <p style={styles.sub}>총 {diaries.length}개의 기록</p>
        </div>
      </div>
      <DiaryList diaries={diaries} onDelete={handleDelete} />
    </div>
  )
}

const styles = {
  header: { marginBottom: 36 },
  title: { fontSize: 26, fontWeight: 600, letterSpacing: -0.5, color: '#e8e8ec' },
  sub: { fontSize: 13, color: '#6b6b78', marginTop: 4 },
}
