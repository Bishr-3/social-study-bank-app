'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<'work' | 'break'>('work')

  useEffect(() => {
    let interval: any = null
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          // Timer finished
          setIsActive(false)
          const newMode = mode === 'work' ? 'break' : 'work'
          setMode(newMode)
          setMinutes(newMode === 'work' ? 25 : 5)
          setSeconds(0)
          alert(newMode === 'work' ? 'حان وقت العمل! 💪' : 'وقت الراحة! ☕')
        }
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, minutes, seconds, mode])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setMinutes(mode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  return (
    <div className="pomodoro-timer card glass" style={{ textAlign: 'center', padding: '40px' }}>
      <h2 style={{ marginBottom: '10px' }}>🍅 مؤقت بومودورو</h2>
      <div className={`badge ${mode === 'work' ? 'badge-violet' : 'badge-teal'}`} style={{ marginBottom: '20px' }}>
        {mode === 'work' ? 'وقت التركيز ✍️' : 'وقت الراحة ☕'}
      </div>

      <div style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '2px', color: 'var(--text-primary)' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button 
          className="btn-glow" 
          onClick={toggleTimer}
          style={isActive ? { background: '#ff4b2b', boxShadow: '0 4px 20px rgba(255, 75, 43, 0.3)' } : {}}
        >
          {isActive ? '⏸️ إيقاف مؤقت' : '▶️ ابدأ الآن'}
        </button>
        <button className="btn-outline" onClick={resetTimer}>
          🔄 إعادة تعيين
        </button>
      </div>

      <div style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        استخدم تقنية "بومودورو" لتعزيز تركيزك: 25 دقيقة عمل مركز، تعقبها 5 دقائق راحة.
      </div>
    </div>
  )
}
