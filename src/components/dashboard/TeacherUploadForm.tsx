'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TeacherUploadFormProps {
  userId: string
  onSuccess: () => void
}

export default function TeacherUploadForm({ userId, onSuccess }: TeacherUploadFormProps) {
  const supabase = createClient()
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'pdf' | 'ppt' | 'video'>('pdf')
  const [subjectId, setSubjectId] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      const { data, error } = await supabase.from('subjects').select('*').order('name_ar')
      if (error) {
        console.error('Error fetching subjects:', error)
        setStatus({ type: 'error', msg: `فشل جلب المواد: ${error.message}` })
      } else if (data) {
        setSubjects(data)
      }
    }
    fetchSubjects()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    let fileUrl = ''

    try {
      // 1. Handle File Upload if not video
      if (type !== 'video' && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('resources')
          .upload(fileName, file)
        
        if (uploadError) throw uploadError
        
        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('resources')
          .getPublicUrl(fileName)
        
        fileUrl = publicUrl
      }

      // 2. Insert into Database
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          title: title,
          title_ar: title,
          type: type,
          subject_id: subjectId,
          uploaded_by: userId,
          file_url: type !== 'video' ? fileUrl : null,
          youtube_url: type === 'video' ? youtubeUrl : null,
          is_approved: true // We'll set it to auto-approve for teachers for now
        })

      if (dbError) throw dbError

      setStatus({ type: 'success', msg: 'تم رفع الدرس بنجاح وسيظهر للطلاب فوراً! 🎉' })
      onSuccess()
      
      // Reset form
      setTitle('')
      setFile(null)
      setYoutubeUrl('')
    } catch (err: any) {
      console.error(err)
      setStatus({ type: 'error', msg: `خطأ: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="form-group">
        <label className="form-label">عنوان الدرس</label>
        <input 
          type="text" 
          className="input-field" 
          required 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="مثال: شرح درس الجاذبية الأرضية"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label">نوع المحتوى</label>
          <select className="input-field" value={type} onChange={e => setType(e.target.value as any)}>
            <option value="pdf">ملخص PDF</option>
            <option value="ppt">عرض بوربوينت PPT</option>
            <option value="video">فيديو يوتيوب</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">المادة الدراسية</label>
          <select className="input-field" required value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            <option value="">اختر المادة...</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name_ar} ({s.education_level})</option>
            ))}
          </select>
        </div>
      </div>

      {type === 'video' ? (
        <div className="form-group">
          <label className="form-label">رابط فيديو اليوتيوب</label>
          <input 
            type="url" 
            className="input-field" 
            required 
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
          />
        </div>
      ) : (
        <div className="form-group">
          <label className="form-label">اختر الملف ({type.toUpperCase()})</label>
          <input 
            type="file" 
            className="input-field" 
            required 
            accept={type === 'pdf' ? '.pdf' : '.ppt,.pptx'}
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </div>
      )}

      {status && (
        <div className={`badge ${status.type === 'success' ? 'badge-teal' : 'badge-gold'}`} style={{ padding: '12px', borderRadius: '8px' }}>
          {status.msg}
        </div>
      )}

      <button type="submit" className="btn-glow" disabled={loading} style={{ padding: '16px' }}>
        {loading ? 'جاري الرفع والمعالجة...' : '🚀 نشر الدرس للطلاب'}
      </button>
    </form>
  )
}
