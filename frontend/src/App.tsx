import { useState, useEffect } from 'react'

function App() {
  const [backendMessage, setBackendMessage] = useState<string>('Loading...')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.json())
      .then((data: { message: string }) => setBackendMessage(data.message))
      .catch(() => setBackendMessage('Error connecting to backend'))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📝 Note Summarizer</h1>
      <p>Frontend is working!</p>
      <p><strong>Backend:</strong> {backendMessage}</p>
    </div>
  )
}

export default App
