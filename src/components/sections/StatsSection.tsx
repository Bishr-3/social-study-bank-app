'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '١٢٠٠٠+', label: 'مورد تعليمي',    icon: '📚', color: 'var(--accent-blue)'   },
  { value: '٣٨٠+',   label: 'مادة دراسية',    icon: '🎓', color: 'var(--accent-violet)' },
  { value: '٤٥٠٠٠+', label: 'طالب مستفيد',    icon: '👨‍🎓', color: 'var(--accent-teal)'   },
  { value: '٩٨٪',    label: 'رضا المستخدمين', icon: '⭐', color: 'var(--accent-gold)'   },
]

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="stats-section" ref={ref}>
      {/* Glow behind */}
      <div className="stats-section__glow" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
        >
          <span className="badge badge-violet">📊 الأرقام تتحدث</span>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="stat-card glass glass-hover"
            >
              <div className="stat-card__icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div
                className="stat-card__value gradient-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${stat.color}, white)`,
                }}
              >
                {stat.value}
              </div>
              <div className="stat-card__label">{stat.label}</div>
              <div
                className="stat-card__bar"
                style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
