import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'الشروط والأحكام - بنك الدروس' }

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="explore-page" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="hero-title gradient-text" style={{ fontSize: '3rem', marginBottom: '24px', textAlign: 'center' }}>الشروط والأحكام</h1>
          <div className="card glass" style={{ padding: '40px', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>1. قبول الشروط</h3>
            <p style={{ marginBottom: '20px' }}>بنقرك على تسجيل دخول أو استخدامك لمنصة "بنك الدروس"، فإنك توافق بكامل إرادتك على الالتزام بجميع القواعد والشروط المدرجة أدناه.</p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>2. حقوق الملكية الفكرية</h3>
            <p style={{ marginBottom: '20px' }}>يجب على رافعي الملفات والعروض والفيديوهات التأكد من أن لديهم حقوق نشر المواد. يمنع منعاً باتاً رفع مواد محمية بحقوق طبع أو نشر دون أخذ إذن صريح من صُناعها.</p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>3. المسؤولية</h3>
            <p style={{ marginBottom: '20px' }}>"بنك الدروس" هي منصة تجميعية. لا نتحمل أي مسؤولية قانونية عن صحة المعلومات العلمية أو الآراء المطروحة داخل الملفات المرفوعة من قبل الطلاب، ولكننا نقوم بمراجعتها دورياً لضمان خلوها من المحتوى المسيء.</p>
            
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>4. الحظر والحذف</h3>
            <p style={{ marginBottom: '20px' }}>نحتفظ بالحق الكامل في حذف أي محتوى يخالف الشروط، أو حظر أي مستخدم ينتهك القواعد دون إنذار مسبق.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
