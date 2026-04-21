'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Resource } from '@/lib/types'

const typeConfig = {
  pdf:   { icon: '📄', label: 'PDF',   badge: 'badge-blue'   },
  ppt:   { icon: '📊', label: 'PPT',   badge: 'badge-violet' },
  video: { icon: '🎬', label: 'فيديو', badge: 'badge-teal'   },
}

interface ResourceCardProps {
  resource: Resource
  index?: number
}

export default function ResourceCard({ resource, index = 0 }: ResourceCardProps) {
  const cfg = typeConfig[resource.type]

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="resource-card card glass-hover"
    >
      {/* Top row */}
      <div className="resource-card__top">
        <span className={`badge ${cfg.badge}`}>
          {cfg.icon} {cfg.label}
        </span>
        <span className="resource-card__subject">
          {resource.subject?.name_ar ?? resource.subject?.name ?? '—'}
        </span>
      </div>

      {/* Thumbnail placeholder */}
      <div className="resource-card__thumb">
        <span className="resource-card__thumb-icon">{cfg.icon}</span>
        {resource.type === 'video' && (
          <span className="resource-card__play">▶</span>
        )}
      </div>

      {/* Body */}
      <div className="resource-card__body">
        <h3 className="resource-card__title">{resource.title}</h3>
        {resource.description && (
          <p className="resource-card__desc">{resource.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="resource-card__footer">
        <div className="resource-card__stats">
          <span title="مشاهدات">👁 {resource.views.toLocaleString('ar')}</span>
          <span title="تنزيلات">⬇ {resource.downloads.toLocaleString('ar')}</span>
          <span title="إعجابات">❤ {resource.likes.toLocaleString('ar')}</span>
        </div>
        <Link
          href={`/resource/${resource.id}`}
          className="resource-card__cta btn-glow"
          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
        >
          عرض
        </Link>
      </div>
    </motion.article>
  )
}

/* ── Skeleton loader ── */
export function ResourceCardSkeleton() {
  return (
    <div className="resource-card card">
      <div className="skeleton-row shimmer-bg" style={{ height: 22, width: '40%', borderRadius: 6 }} />
      <div className="resource-card__thumb shimmer-bg" style={{ background: 'none' }} />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="shimmer-bg" style={{ height: 18, borderRadius: 6 }} />
        <div className="shimmer-bg" style={{ height: 14, width: '75%', borderRadius: 6 }} />
      </div>
    </div>
  )
}
