import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 글로벌 스타일 초기화
const style = document.createElement('style')
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans KR', -apple-system, sans-serif;
    font-weight: 300;
    background: #0f0f11;
    color: #e8e8ec;
  }
  a { text-decoration: none; }
  input, textarea, button, select {
    font-family: inherit;
  }
  input[type='time']::-webkit-calendar-picker-indicator,
  input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(0.5);
  }
`
document.head.appendChild(style)

// Google Fonts
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&display=swap'
document.head.appendChild(link)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
