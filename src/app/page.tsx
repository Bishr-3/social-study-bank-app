'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import StatsSection from '@/components/sections/StatsSection'
import FeaturesSection from '@/components/sections/FeaturesSection'

const HeroSceneWrapper = dynamic(
  () => import('@/components/3d/HeroSceneWrapper'),
  { ssr: false }
)

/* ── Sample resource types for type strip ── */
const typeStrip = [
  { icon: '📄', label: 'ملخص PDF',      badge: 'badge-blue' },
  { icon: '📊', label: 'عرض PPT',       badge: 'badge-violet' },
  { icon: '🎬', label: 'فيديو YouTube', badge: 'badge-teal' },
]

/* ── Subject chips ── */
const subjects = [
  'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء',
  'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا',
]

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Safeguard: If the user lands here with a ?code= parameter (Supabase OAuth callback leak),
  // redirect them to the proper callback handler.
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      const next = searchParams.get('next') || '/dashboard'
      router.replace(`/auth/callback?code=${code}&next=${next}`)
    }
  }, [searchParams, router])
  return (
    <>
      <Navbar />

      <main>
        {/* ═══════════════════════════════════════ */}
        {/*              HERO SECTION               */}
        {/* ═══════════════════════════════════════ */}
        <section className="hero-section grid-bg">
          {/* 3-D Canvas — absolute behind text */}
          <div className="hero-section__canvas">
            <HeroSceneWrapper />
          </div>

          {/* Radial glow orbs */}
          <div className="hero-glow hero-glow--blue"   />
          <div className="hero-glow hero-glow--violet" />
          <div className="hero-glow hero-glow--teal"   />

          {/* Text content */}
          <div className="hero-content container">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge badge-violet hero-badge pulse-glow">
                🚀 المنصة التعليمية العربية الأولى · v2.0
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="hero-title"
            >
              مستودعك الرقمي<br />
              <span className="gradient-text">لكل الدروس</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="hero-subtitle"
            >
              ابحث، تصفّح، وشارك آلاف الملخصات والعروض والفيديوهات<br className="hide-mobile" />
              في منصة واحدة مصممة خصيصاً للطالب العربي.
            </motion.p>

            {/* Type strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="hero-type-strip"
            >
              {typeStrip.map(t => (
                <span key={t.label} className={`badge ${t.badge}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                  {t.icon} {t.label}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              className="hero-cta"
            >
              <Link href="/explore" className="btn-glow hero-btn-primary">
                🔍 ابدأ الاستكشاف
              </Link>
              <Link href="/login" className="btn-outline hero-btn-secondary">
                انضم مجاناً ←
              </Link>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="hero-scroll-hint"
            >
              <span className="hero-scroll-hint__arrow">↓</span>
              <span>اكتشف المزيد</span>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/*            QUICK LINKS SECTION         */}
        {/* ═══════════════════════════════════════ */}
        <section className="quick-links-section container" style={{ padding: '60px 0', zIndex: 5, position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <Link href="/about" className="card glass-hover" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🎯</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>أهداف المشروع</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>تعرف على رؤيتنا وهدفنا في تطوير التعليم الرقمي.</p>
            </Link>
            <Link href="/contact" className="card glass-hover" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📞</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>اتصل بنا</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>نحن هنا لدعمك والإجابة على أي استفسارات.</p>
            </Link>
            <Link href="/privacy" className="card glass-hover" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🔒</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>سياسة الخصوصية</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>كيف نحمي بياناتك ومعلوماتك الشخصية.</p>
            </Link>
            <Link href="/terms" className="card glass-hover" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📄</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>الشروط والأحكام</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>القواعد المتبعة لاستخدام منصة بنك الدروس.</p>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/*           SUBJECTS STRIP               */}
        {/* ═══════════════════════════════════════ */}
        <section className="subjects-strip-section" style={{ paddingTop: '20px' }}>
          <div className="container">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="subjects-strip__label"
            >
              المواد الدراسية المتاحة
            </motion.p>
            <div className="subjects-strip">
              {subjects.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link href={`/subjects/${encodeURIComponent(s)}`} className="subject-chip glass glass-hover">
                    {s}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════ */}
        {/*             STATS SECTION              */}
        {/* ═══════════════════════════════════════ */}
        <StatsSection />

        {/* ═══════════════════════════════════════ */}
        {/*           FEATURES SECTION             */}
        {/* ═══════════════════════════════════════ */}
        <FeaturesSection />

        {/* ═══════════════════════════════════════ */}
        {/*              CTA BANNER                */}
        {/* ═══════════════════════════════════════ */}
        <section className="cta-banner-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="cta-banner glass"
            >
              <div className="cta-banner__glow" />
              <h2 className="cta-banner__title">
                ابدأ رحلة التعلم اليوم
              </h2>
              <p className="cta-banner__subtitle">
                سجّل الآن مجاناً وادخل إلى مستودع ضخم من المواد التعليمية المنظمة.
              </p>
              <div className="cta-banner__actions">
                <Link href="/register" className="btn-glow" style={{ fontSize: '1rem', padding: '15px 36px' }}>
                  🎓 إنشاء حساب مجاني
                </Link>
                <Link href="/explore" className="btn-outline">
                  تصفّح بدون حساب
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
