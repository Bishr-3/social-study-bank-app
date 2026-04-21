import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم — بنك الدروس',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'مرحباً'

  const quickStats = [
    { icon: '📚', label: 'موارد محفوظة',   value: '٠',  color: 'rgba(79,142,247,0.15)',  iconColor: 'var(--accent-blue)'   },
    { icon: '⬆',  label: 'مواد رفعتها',    value: '٠',  color: 'rgba(124,92,252,0.15)', iconColor: 'var(--accent-violet)' },
    { icon: '❤',  label: 'إعجاباتي',        value: '٠',  color: 'rgba(0,212,170,0.15)',  iconColor: 'var(--accent-teal)'   },
  ]

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-welcome">
              أهلاً، <span className="gradient-text">{displayName}</span> 👋
            </h1>
            <p className="dashboard-sub">
              هنا ملخص نشاطك على منصة بنك الدروس
            </p>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-grid">
            {quickStats.map(s => (
              <div key={s.label} className="dashboard-stat-card card">
                <div
                  className="dashboard-stat-icon"
                  style={{ background: s.color, color: s.iconColor }}
                >
                  {s.icon}
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-val">{s.value}</div>
                  <div className="dashboard-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div className="card glass" style={{ padding: '60px 40px', textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 16 }}>🚀</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 10 }}>
              ابدأ استكشاف المحتوى
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              تصفّح آلاف الموارد التعليمية أو شارك موادك مع المجتمع.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/explore" className="btn-glow">🔍 استكشف الآن</a>
              <a href="/upload"  className="btn-outline">⬆ شارك مادة</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
