'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export default function StudyPlanner() {
  const [examDate, setExamDate] = useState('')
  const [subjects, setSubjects] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generatePlan = async () => {
    if (!examDate || !subjects) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'study-plan',
          payload: `تاريخ الامتحانات: ${examDate}، المواد: ${subjects}`
        })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setPlan(data.result)
    } catch (err) {
      setError('حدث خطأ أثناء توليد الجدول.')
    }
    setLoading(false)
  }

  return (
    <div className="study-planner">
      <div className="card glass" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>📅 مولد جدول المذاكرة الذكي</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">تاريخ بداية الامتحانات</label>
            <input 
              type="date" 
              className="input-field" 
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">المواد الدراسية (مفصولة بفاصلة)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="رياضيات، فيزياء، لغويات..."
              value={subjects}
              onChange={e => setSubjects(e.target.value)}
            />
          </div>
        </div>

        <button 
          className="btn-glow" 
          style={{ width: '100%' }}
          onClick={generatePlan}
          disabled={loading || !examDate || !subjects}
        >
          {loading ? 'جاري التفكير وتوليد الجدول...' : '✨ ابدأ توليد الجدول الذكي'}
        </button>

        {error && (
          <div className="badge badge-teal" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {plan && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass" 
          style={{ marginTop: '30px', padding: '40px' }}
        >
          <div className="markdown-content">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <button 
            className="btn-outline" 
            style={{ marginTop: '20px' }}
            onClick={() => window.print()}
          >
            🖨️ طباعة الجدول
          </button>
        </motion.div>
      )}
    </div>
  )
}
