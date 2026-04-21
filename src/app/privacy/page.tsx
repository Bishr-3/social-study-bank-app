import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'سياسة الخصوصية - بنك الدروس' }

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="explore-page" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="hero-title gradient-text" style={{ fontSize: '3rem', marginBottom: '24px', textAlign: 'center' }}>سياسة الخصوصية</h1>
          <div className="card glass" style={{ padding: '40px', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>نحن نهتم ببياناتك! 🛡️</h3>
            <p style={{ marginBottom: '20px' }}>
              في منصة "بنك الدروس"، نعتبر خصوصية الطالب والبيانات الشخصية أمراً بالغ الأهمية والمحور الأساسي في تجربتنا الأمنية.
            </p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>البيانات التي نجمعها</h3>
            <ul style={{ listStylePosition: 'inside', paddingLeft: '10px', marginBottom: '20px' }}>
              <li>بريدك الإلكتروني واسمك الكامل (لاستخدامهما في تعريفك بالموقع حصراً).</li>
              <li>الدروس التي تقوم بإضافتها أو الإعجاب بها لتحسين ترشيحات الموقع لك.</li>
            </ul>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>حماية معلوماتك</h3>
            <p style={{ marginBottom: '20px' }}>
              نعتمد على تقنيات التشفير الحديثة بالتعاون مع شراكة التوثيق (Google Oauth / Supabase). نحن لا نبيع بياناتك ولا نمررها لأطراف خارجية تحت أي ظرف من الظروف.
            </p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>الكوكيز (ملفات الارتباط)</h3>
            <p style={{ marginBottom: '20px' }}>
              نستخدم ملفات ارتباط تقنية فقط، وتحديداً للحفاظ على بقائك "مُسجل الدخول" حتى لا تضطر لكتابة بياناتك في كل مرة (جلسات الأمان Session Cookies).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
