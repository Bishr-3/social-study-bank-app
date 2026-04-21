import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const metadata = { title: 'أهداف المشروع - بنك الدروس' }

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="explore-page" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="hero-title gradient-text" style={{ fontSize: '3rem', marginBottom: '24px', textAlign: 'center' }}>أهداف المشروع</h1>
          <div className="card glass" style={{ padding: '40px', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '20px' }}>
              منصة <strong>"بنك الدروس"</strong> ليست مجرد موقع إلكتروني، بل هي حلم يتحقق لجميع الطلاب العرب. هدفنا الأساسي هو بناء مستودع رقمي ضخم، مفتوح، ومجاني بالكامل لمشاركة كل ما يحتاجه الطالب من أدوات تعليمية.
            </p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '30px', marginBottom: '16px' }}>رؤيتنا 🌟</h3>
            <ul style={{ listStylePosition: 'inside', paddingLeft: '10px' }}>
              <li>تسهيل الوصول إلى المعرفة لأي طالب وفي أي وقت.</li>
              <li>القضاء على مشكلة ضياع المذكرات وتشتت الملفات الدراسية.</li>
              <li>دعم وتمكين المعلمين والطلاب لتبادل المنفعة فيما بينهم.</li>
            </ul>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '30px', marginBottom: '16px' }}>كيف بدأت الفكرة؟ 🚀</h3>
            <p>
              بدأت الفكرة من معاناة حقيقية لتتبع الدروس والبحث المستمر في مجموعات وسائل التواصل الاجتماعي. لذا، تم تطوير هذه المنصة بأحدث التقنيات لتوفر سرعة بحث، تصنيفات واضحة، وتجربة مستخدم ممتعة وتفاعلية!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
