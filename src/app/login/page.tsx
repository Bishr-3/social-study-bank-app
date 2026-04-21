'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false })

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
      } else {
        router.push('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد حسابك.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      {/* 3D Background */}
      <div className="login-page__bg">
        <HeroScene />
      </div>
      <div className="login-page__overlay" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="login-card glass"
      >
        {/* Logo */}
        <div className="login-card__logo">
          <span style={{ fontSize: '2rem' }}>⬡</span>
          <h1 className="login-card__brand">
            بنك <span className="gradient-text">الدروس</span>
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="login-card__tabs">
          <button
            className={`login-card__tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
          >
            دخول
          </button>
          <button
            className={`login-card__tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(null); setSuccess(null) }}
          >
            حساب جديد
          </button>
          <div className={`login-card__tab-indicator ${mode === 'register' ? 'right' : 'left'}`} />
        </div>

        {/* Google Login */}
        <button
          className="login-card__google glass-hover"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
            <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
            <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
            <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
          </svg>
          المتابعة عبر Google
        </button>

        {/* Divider */}
        <div className="login-card__divider">
          <span>أو</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-card__form">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <input
                id="fullName"
                type="text"
                className="input-field"
                placeholder="أدخل اسمك الكامل"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              dir="ltr"
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              dir="ltr"
            />
          </div>

          {mode === 'login' && (
            <a href="/forgot-password" className="login-card__forgot">
              نسيت كلمة المرور؟
            </a>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="login-card__alert error"
            >
              ⚠ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="login-card__alert success"
            >
              ✅ {success}
            </motion.div>
          )}

          <button
            type="submit"
            className="btn-glow"
            style={{ width: '100%', marginTop: 4 }}
            disabled={loading}
          >
            {loading
              ? '...'
              : mode === 'login'
              ? 'تسجيل الدخول'
              : 'إنشاء الحساب'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
