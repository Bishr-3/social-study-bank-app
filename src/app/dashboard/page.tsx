'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import dynamic from 'next/dynamic'

// Dynamic imports for heavy tools to keep bundle light
const StudyPlanner = dynamic(() => import('@/components/dashboard/StudyPlanner'), { ssr: false })
const AISummarizer = dynamic(() => import('@/components/dashboard/AISummarizer'), { ssr: false })
const HomeworkFixer = dynamic(() => import('@/components/dashboard/HomeworkFixer'), { ssr: false })
const PomodoroTimer = dynamic(() => import('@/components/dashboard/PomodoroTimer'), { ssr: false })
const TodoList = dynamic(() => import('@/components/dashboard/TodoList'), { ssr: false })

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'study' | 'library'>('overview')
  const [loading, setLoading] = useState(true)

  const [showRoleSelection, setShowRoleSelection] = useState(false)

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      
      if (prof) {
        setProfile(prof)
        // Check if user is a teacher and redirect
        if (prof.role === 'teacher') {
          router.push('/teacher')
          return
        }
        // If it's a fresh account with no education level set, maybe ask for role
        if (!prof.education_level && prof.role === 'student') {
          setShowRoleSelection(true)
        }
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  const handleSelectRole = async (role: 'student' | 'teacher') => {
     setLoading(true)
     const { error } = await supabase.from('profiles').update({ role }).eq('id', user.id)
     if (!error) {
       if (role === 'teacher') {
         router.push('/teacher')
       } else {
         setShowRoleSelection(false)
       }
     }
     setLoading(false)
  }

  if (loading) return <div className="loader-overlay"><div className="hero-scene-loader"></div></div>

  if (showRoleSelection) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card glass" style={{ padding: '50px', textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ marginBottom: '10px' }}>مرحباً بك في بنك الدروس 🎉</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>أخبرنا قليلاً عنك لنعرف كيف يمكننا خدمتك بشكل أفضل.</p>
            <div style={{ display: 'grid', gap: '16px' }}>
               <button className="btn-glow" onClick={() => handleSelectRole('student')}>
                  🎓 أنا طالب (أبحث عن ملخصات)
               </button>
               <button className="btn-outline" onClick={() => handleSelectRole('teacher')}>
                  👨‍🏫 أنا معلم (أريد مشاركة دروسي)
               </button>
            </div>
         </motion.div>
      </div>
    )
  }

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'مرحباً'

  const tabs = [
    { id: 'overview', label: 'الرئيسية', icon: '🏠' },
    { id: 'ai',       label: 'أدوات الذكاء الاصطناعي', icon: '✨' },
    { id: 'study',    label: 'مركز المذاكرة', icon: '📂' },
    { id: 'library',  label: 'مكتبتي', icon: '📚' },
  ]

  return (
    <>
      <Navbar />
      <main className="dashboard-page" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container">
          
          {/* Dashboard Top Header */}
          <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
               <motion.h1 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="dashboard-welcome" style={{ fontSize: '2.4rem', fontWeight: 900 }}
               >
                 أهلاً، <span className="gradient-text">{displayName}</span> 👋
               </motion.h1>
               <p style={{ color: 'var(--text-secondary)' }}>بوابتك التعليمية الشاملة بكل الأدوات التي تحتاجها للنجاح.</p>
            </div>
            
            <div className="badge badge-blue pulse-glow" style={{ padding: '10px 20px', borderRadius: '12px' }}>
              🎖️ رتبة الطالب: {profile?.role === 'student' ? 'عضو مميز' : 'معلم معتمد'}
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="dashboard-tabs glass" style={{ display: 'flex', gap: '10px', padding: '8px', borderRadius: '16px', marginBottom: '30px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--accent-violet)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ paddingBottom: '60px' }}
            >
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div className="card glass" style={{ padding: '30px' }}>
                    <h3>📈 نشاطك الأخير</h3>
                    <div style={{ marginTop: '20px', textAlign: 'center', padding: '40px 0' }}>
                       <span style={{ fontSize: '3rem', opacity: 0.3 }}>📊</span>
                       <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>لا توجد بيانات كافية لعرض الإحصائيات حالياً.</p>
                    </div>
                  </div>
                  <div className="card glass" style={{ padding: '30px' }}>
                    <h3>🔔 تنبيهات تعليمية</h3>
                    <div style={{ marginTop: '15px' }}>
                      <div style={{ padding: '12px', background: 'rgba(79, 142, 247, 0.1)', borderRadius: '10px', marginBottom: '10px', fontSize: '0.9rem' }}>
                         🎉 مرحباً بك في النسخة الجديدة من بنك الدروس!
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(124, 92, 252, 0.1)', borderRadius: '10px', fontSize: '0.9rem' }}>
                         ✅ محرك التلخيص والذكاء الاصطناعي متاح الآن في تبويب "أدوات الذكاء الاصطناعي".
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div style={{ display: 'grid', gap: '30px' }}>
                  <AISummarizer />
                  <HomeworkFixer />
                </div>
              )}

              {activeTab === 'study' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }} className="study-hub-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <StudyPlanner />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <PomodoroTimer />
                    <TodoList />
                  </div>
                </div>
              )}

              {activeTab === 'library' && (
                <div className="card glass" style={{ padding: '60px 40px', textAlign: 'center' }}>
                  <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 16 }}>🚀</span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 10 }}>ابدأ استكشاف المحتوى</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>تصفّح آلاف الموارد التعليمية أو شارك موادك مع المجتمع.</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/explore" className="btn-glow">🔍 استكشف الآن</a>
                    <a href="/upload"  className="btn-outline">⬆ شارك مادة</a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .tab-btn:hover {
          background: rgba(124, 92, 252, 0.8) !important;
          color: white !important;
          transform: translateY(-2px);
        }
        @media (max-width: 992px) {
          .study-hub-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .loader-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          z-index: 9999;
        }
      `}</style>
    </>
  )
}
