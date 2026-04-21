import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'بنك الدروس | Lesson Bank — مستودع التعلم الذكي',
  description:
    'منصة تعليمية متكاملة تجمع الملخصات والعروض والفيديوهات في مكان واحد. استعرض آلاف الموارد التعليمية المنظمة.',
  keywords: 'تعليم, ملخصات, عروض, فيديوهات, بنك الدروس, lesson bank',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'بنك الدروس — مستودع التعلم الذكي',
    description: 'منصة تعليمية متكاملة تجمع الملخصات والعروض والفيديوهات.',
    siteName: 'بنك الدروس',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="noise">{children}</body>
    </html>
  )
}
