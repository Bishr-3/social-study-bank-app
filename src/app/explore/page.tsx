'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Resource } from '@/lib/types'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import ResourceCard, { ResourceCardSkeleton } from '@/components/ui/ResourceCard'

export default function ExplorePage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'docs'>('all')

  useEffect(() => {
    async function fetchResources() {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          subject:subjects(id, name, name_ar, icon, color),
          uploader:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setResources(data as Resource[])
      } else {
        console.error('Error fetching resources:', error)
      }
      setLoading(false)
    }
    
    fetchResources()
  }, [])

  const filteredResources = resources.filter(res => {
    if (activeTab === 'all') return true
    if (activeTab === 'video') return res.type === 'video'
    if (activeTab === 'docs') return res.type === 'pdf' || res.type === 'ppt'
    return true
  })

  return (
    <>
      <Navbar />
      <main className="explore-page" style={{ paddingTop: '100px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="explore-header"
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>
              استكشف <span className="gradient-text">المواد</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '0 auto' }}>
              تصفح آلاف الفيديوهات، الملخصات، والعروض التقديمية في جميع المواد الدراسية.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="explore-tabs"
            style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}
          >
            <button 
              className={`btn-outline ${activeTab === 'all' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('all')}
              style={activeTab === 'all' ? { background: 'var(--accent-blue)', color: 'white', borderColor: 'var(--accent-blue)' } : {}}
            >
              📚 الكل
            </button>
            <button 
              className={`btn-outline ${activeTab === 'video' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('video')}
              style={activeTab === 'video' ? { background: 'var(--accent-teal)', color: 'white', borderColor: 'var(--accent-teal)' } : {}}
            >
              🎬 الفيديوهات
            </button>
            <button 
              className={`btn-outline ${activeTab === 'docs' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('docs')}
              style={activeTab === 'docs' ? { background: 'var(--accent-violet)', color: 'white', borderColor: 'var(--accent-violet)' } : {}}
            >
              📄 الملخصات (PDF/PPT)
            </button>
          </motion.div>

          {loading ? (
            <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => <ResourceCardSkeleton key={i} />)}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredResources.map((resource, idx) => (
                <ResourceCard key={resource.id} resource={resource} index={idx} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📭</span>
              <h3>لا توجد مواد متاحة حالياً</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>لم يتم العثور على أي موارد تطابق تصنيفك الحالي.</p>
            </div>
          )}
          
        </div>
      </main>
      <Footer />
    </>
  )
}
