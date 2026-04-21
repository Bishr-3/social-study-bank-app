'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function HomeworkFixer() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFix = async () => {
    if (!content) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fix-homework',
          payload: content
        })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data.result)
    } catch (err) {
      setError('حدث خطأ أثناء فحص الواجب.')
    }
    setLoading(false)
  }

  return (
    <div className="homework-fixer">
      <div className="card glass" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>✍️ مصحح الواجبات الذكي</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
          ألصق سؤالك أو إجابتك هنا ليقوم المعلم الذكي بمراجعتها وتصحيحها فوراً.
        </p>

        <textarea 
          className="input-field" 
          style={{ minHeight: '120px', marginBottom: '20px', fontSize: '1rem' }}
          placeholder="اكتب السؤال أو إجابتك هنا..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button 
          className="btn-glow" 
          style={{ width: '100%' }}
          onClick={handleFix}
          disabled={loading || !content}
        >
          {loading ? 'جاري الفحص المجهري للواجب...' : '✨ اطلب التصحيح الآن'}
        </button>

        {error && (
          <div className="badge badge-teal" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card glass" 
          style={{ marginTop: '30px', padding: '40px', background: 'rgba(255, 255, 255, 0.8)', color: '#1a1a2e' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '2.5rem' }}>🧑‍🏫</span>
            <div>
              <h3 style={{ margin: 0 }}>ملاحظات المعلم الذكي:</h3>
              <small style={{ color: '#666' }}>تم المراجعة بناءً على المعايير التعليمية</small>
            </div>
          </div>
          <div className="markdown-content" style={{ color: '#333' }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  )
}
