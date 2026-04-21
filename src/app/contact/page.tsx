import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'اتصل بنا - بنك الدروس' }

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="explore-page" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="hero-title gradient-text" style={{ fontSize: '3rem', marginBottom: '24px', textAlign: 'center' }}>اتصل بنا</h1>
          <div className="card glass" style={{ padding: '40px', textAlign: 'center', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '30px', fontSize: '1.2rem' }}>
              نحن دائماً سعداء بالاستماع لآرائكم ومقترحاتكم أو حتى حل أي مشكلة قد تواجهونها في المنصة. 💬
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
              <div className="badge badge-blue" style={{ fontSize: '1.2rem', padding: '16px 30px' }}>
                📧 الإيميل الرسمي: <strong>support@socialstudybank.com</strong>
              </div>
              <div className="badge badge-violet" style={{ fontSize: '1.2rem', padding: '16px 30px' }}>
                📱 تيليجرام: <strong>@LessonBankSupport</strong>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)' }}>
              سنحاول الرد على جميع رسائلكم في أسرع وقت. ننتظر بشوق لنتلقى منكم الاقتراحات المميزة التي تساعدنا في تطوير التطبيق ليكون الأفضل دوماً.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
