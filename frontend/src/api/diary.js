import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const diaryApi = {
  save:       (diary)  => api.post('/diary', diary),
  findAll:    ()       => api.get('/diary'),
  findByDate: (date)   => api.get(`/diary/${date}`),
  remove:     (date)   => api.delete(`/diary/${date}`),
}

export const anomalyApi = {
  analyze: (date) => api.get(`/anomaly/${date}`),
}
