'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    icon: '📄',
    title: 'ملخصات PDF',
    desc: 'آلاف الملخصات الاحترافية منظمة حسب المادة والمستوى، جاهزة للتحميل الفوري.',
    color: 'var(--accent-blue)',
    gradient: 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(79,142,247,0.02))',
  },
  {
    icon: '📊',
    title: 'عروض PowerPoint',
    desc: 'شرائح تفاعلية وعروض بصرية من أفضل المعلمين، مناسبة للدراسة والتقديم.',
    color: 'var(--accent-violet)',
    gradient: 'linear-gradient(135deg, rgba(124,92,252,0.2), rgba(124,92,252,0.02))',
  },
  {
    icon: '🎬',
    title: 'فيديوهات YouTube',
    desc: 'مكتبة ضخمة من الفيديوهات التعليمية المدمجة مباشرة من يوتيوب دون مغادرة المنصة.',
    color: 'var(--accent-teal)',
    gradient: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(0,212,170,0.02))',
  },
  {
    icon: '🔍',
    title: 'بحث ذكي',
    desc: 'محرك بحث متقدم يفهم اللغة العربية ويقترح المحتوى المناسب لمستواك الدراسي.',
    color: 'var(--accent-gold)',
    gradient: 'linear-gradient(135deg, rgba(245,200,66,0.2), rgba(245,200,66,0.02))',
  },
  {
    icon: '📚',
    title: 'مكتبة شخصية',
    desc: 'احفظ موادك المفضلة في مجموعات خاصة وشاركها مع زملائك بنقرة واحدة.',
    color: 'var(--accent-blue)',
    gradient: 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(79,142,247,0.02))',
  },
  {
    icon: '🌐',
    title: 'مجتمع تعليمي',
    desc: 'شارك موادك، قيّم محتوى الآخرين، وانضم إلى أكبر مجتمع تعليمي عربي.',
    color: 'var(--accent-violet)',
    gradient: 'linear-gradient(135deg, rgba(124,92,252,0.2), rgba(124,92,252,0.02))',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="features-section" ref={ref}>
      <div className="container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          <span className="badge badge-teal" style={{ marginBottom: 16, display: 'inline-block' }}>
            ✨ مميزات المنصة
          </span>
          <h2 className="section-title">
            كل ما تحتاجه للتعلم<br />
            <span className="gradient-text">في مكان واحد</span>
          </h2>
          <p className="section-subtitle">
            منصة متكاملة تجمع أفضل الموارد التعليمية بتصميم عصري وتجربة مستخدم استثنائية.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {features.map(f => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className="feature-card glass glass-hover"
              style={{ background: f.gradient, borderColor: `${f.color}22` }}
            >
              <div className="feature-card__icon" style={{ color: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-card__title" style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className="feature-card__desc">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
