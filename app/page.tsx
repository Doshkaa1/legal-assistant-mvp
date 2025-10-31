'use client'
import React, { useState } from 'react'

type Message = { role: 'user'|'assistant', content: string }

export default function Home() {
  const [q, setQ] = useState('My boss keeps touching me at work. What can I do?')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      })
      const data = await res.json()
      setMessages(m => [...m, { role:'user', content:q }, { role:'assistant', content:data.answer }])
      setQ('')
    } catch (e:any) {
      setMessages(m => [...m, { role:'assistant', content:'Error: ' + (e?.message || 'unknown') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Legal Info Assistant — LA Employment (MVP)</h2>
        <span className="badge">General legal information • Not legal advice</span>
      </div>

      <div className="small">
        This demo provides neutral, non-advisory summaries with public-source pointers and optional similar cases.
        Answers are auto-labeled for jurisdictional scope (Local → State → Federal). Always consult a licensed attorney for advice.
      </div>
      <nav style={{ marginBottom: '20px' }}>
  <a href="/">Home</a> | <a href="/about">About</a> | <a href="/disclaimer">Disclaimer</a>
</nav>

      <div className="hr" />

      <div>
  {messages.map((m, i) => (
    <div
      key={i}
      className={`msg ${m.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}
    >
      {m.content}
    </div>
  ))}
</div>


      <div className="inputRow">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Type your question..." />
        <button onClick={ask} disabled={loading}>{loading ? 'Working…' : 'Ask'}</button>
      </div>

      <div className="hr" />

      <div className="small">
        Built for internal testing. Content may be incomplete. Data refresh runs weekly.
      </div>
    </div>
  )
}
