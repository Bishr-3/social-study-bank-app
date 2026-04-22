'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import TeacherUploadForm from '@/components/dashboard/TeacherUploadForm'

export default function TeacherDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'my-content'>('overview')

  // Form states for profile setup
  const [isSetup, setIsSetup] = useState(false)
  const [fullName, setFullName] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')

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
        if (prof.role !== 'teacher') {
          // If a student tries to enter, redirect to student dashboard
          router.push('/dashboard')
          return
        }
        setProfile(prof)
        setFullName(prof.full_name || '')
        setGrade(prof.education_level || '')
        // We can use metadata or another field for 'subject' if needed
        setIsSetup(!!prof.full_name)
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        education_level: grade,
        role: 'teacher'
      })
      .eq('id', user.id)
    
    if (!error) {
      setIsSetup(true)
      setProfile({ ...profile, full_name: fullName, education_level: grade })
    }
    setLoading(false)
  }

  if (loading) return <div className="loader-overlay"><div className="hero-scene-loader"></div></div>

  // If teacher hasn't set their name/grade yet, show Setup Screen
  if (!isSetup) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <div className="container" style={{ maxWidth: '600px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card glass" style={{ padding: '40px' }}>
              <h1 style={{ marginBottom: '10px' }}>👨‍🏫 إكمال ملف المعلم</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>يرجى إدخال بياناتك المهنية لتبدأ برفع دروسك للطلاب.</p>
              
              <form onSubmit={handleCompleteSetup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">الاسم الكامل</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="مثال: أ. محمد أحمد"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">المرحلة الدراسية التي تدرسها</label>
                  <select 
                    className="input-field" 
                    required
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                  >
                    <option value="">اختر المرحلة...</option>
                    <option value="primary">الابتدائية</option>
                    <option value="middle">الإعدادية</option>
                    <option value="high">الثانوية</option>
                    <option value="university">الجامعية</option>
                  </select>
                </div>
                <button type="submit" className="btn-glow" style={{ marginTop: '10px' }}>
                  حفظ والبدء 🚀
                </button>
              </form>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="teacher-dashboard" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container">
          
          <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
               <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>
                 لوحة <span className="gradient-text">المعلم</span> 👨‍🏫
               </h1>
               <p style={{ color: 'var(--text-secondary)' }}>مرحباً بك د. {profile?.full_name}. تحكم في دروسك المنشورة هنا.</p>
            </div>
            <button className="btn-glow" style={{ borderRadius: '12px' }} onClick={() => setActiveTab('upload')}>
              ➕ رفع درس جديد
            </button>
          </header>

          <div className="dashboard-tabs glass" style={{ display: 'flex', gap: '10px', padding: '8px', borderRadius: '16px', marginBottom: '30px' }}>
            <button onClick={() => setActiveTab('overview')} className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}>📊 إحصائياتي</button>
            <button onClick={() => setActiveTab('upload')} className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}>⬆️ رفع محتوى</button>
            <button onClick={() => setActiveTab('my-content')} className={`tab-btn ${activeTab === 'my-content' ? 'active' : ''}`}>📚 دروسي المنشورة</button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content">
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div className="card glass" style={{ padding: '30px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>إجمالي المشاهدات</h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '15px 0' }}>0</div>
                    <div className="badge badge-teal">تفاعل ممتاز</div>
                  </div>
                  <div className="card glass" style={{ padding: '30px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>الدروس المنشورة</h4>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '15px 0' }}>0</div>
                  </div>
                </div>
              )}

import TeacherUploadForm from '@/components/dashboard/TeacherUploadForm'

// ... in the component tabs logic ...
              {activeTab === 'upload' && (
                <div className="card glass" style={{ padding: '40px' }}>
                  <TeacherUploadForm 
                    userId={user.id} 
                    onSuccess={() => setActiveTab('my-content')} 
                  />
                </div>
              )}

              {activeTab === 'my-content' && (
                <div className="card glass" style={{ padding: '40px' }}>
                  <h3>📚 دروسي المنشورة</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>هنا تظهر جميع المواد التي قمت بمشاركتها مع الطلاب.</p>
                  
                  {/* For now, we show a simplified list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <div className="glass" style={{ padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                        🎉 سيطوي هذا القسم جميع دروسك قريباً. الدروس التي قمت برفعها الآن ستظهر للطالب في صفحة الاستكشاف.
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
      <Footer />
      <style jsx>{`
        .tab-btn {
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .tab-btn.active {
          background: var(--accent-blue);
          color: white;
        }
      `}</style>
    </>
  )
}
