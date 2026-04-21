'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function AISummarizer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSumarize = async () => {
    if (!text) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summarize',
          payload: text
        })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setSummary(data.result)
    } catch (err) {
      setError('حدث خطأ أثناء التلخيص.')
    }
    setLoading(false)
  }

  return (
    <div className="ai-summarizer">
      <div className="card glass" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>📄 ملخص الـ PDF التلقائي</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
          ألصق النص المستخرج من ملفك أو اكتب النقاط التي تريد تلخيصها وسيقوم الذكاء الاصطناعي بالباقي.
        </p>

        <textarea 
          className="input-field" 
          style={{ minHeight: '150px', marginBottom: '20px', fontSize: '1rem' }}
          placeholder="ألصق النص هنا..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <button 
          className="btn-glow" 
          style={{ width: '100%' }}
          onClick={handleSumarize}
          disabled={loading || !text}
        >
          {loading ? 'جاري القراءة والتلخيص...' : '✨ ابدأ التلخيص الذكي'}
        </button>

        {error && (
          <div className="badge badge-teal" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {summary && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card glass" 
          style={{ marginTop: '30px', padding: '40px', borderRight: '4px solid var(--accent-violet)' }}
        >
          <h3 style={{ marginBottom: '20px', color: 'var(--accent-violet)' }}>📝 ملخص الذكاء الاصطناعي:</h3>
          <div className="markdown-content">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  )
}
