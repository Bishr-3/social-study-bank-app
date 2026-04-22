'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('role').eq('id', data.user.id).single()
          .then(({ data: prof }) => setProfile(prof))
      }
    })
    
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data: prof }) => setProfile(prof))
      } else {
        setProfile(null)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/explore',   label: 'استكشف' },
    { href: '/subjects',  label: 'المواد' },
    { href: '/dashboard', label: 'مكتبتي' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      >
        <div className="navbar__inner">
          {/* Logo */}
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-icon">⬡</span>
            <span className="navbar__logo-text">
              بنك <span className="gradient-text">الدروس</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="navbar__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="navbar__auth">
            {user ? (
              <div className="navbar__user" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link 
                  href={profile?.role === 'teacher' ? '/teacher' : '/dashboard'} 
                  className="btn-glow" 
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                >
                  {profile?.role === 'teacher' ? '👨‍🏫 لوحة المعلم' : '🏠 لوحة التحكم'}
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="btn-outline" 
                  style={{ padding: '8px 15px', fontSize: '0.8rem' }}
                >
                  خروج
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  دخول
                </Link>
                <Link href="/login" className="btn-glow" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                  انضم الآن
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu glass"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-menu__link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mobile-menu__divider" />
            {user ? (
              <button
                className="btn-glow"
                style={{ width: '100%' }}
                onClick={() => { supabase.auth.signOut(); setMenuOpen(false) }}
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link href="/login" className="btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                تسجيل الدخول
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
