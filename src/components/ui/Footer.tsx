import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    'المنصة': [
      { href: '/explore',  label: 'استكشف الموارد' },
      { href: '/subjects', label: 'المواد الدراسية' },
      { href: '/upload',   label: 'شارك مواد' },
    ],
    'الدعم': [
      { href: '/about',   label: 'عن المنصة' },
      { href: '/contact', label: 'تواصل معنا' },
      { href: '/faq',     label: 'الأسئلة الشائعة' },
    ],
    'قانوني': [
      { href: '/privacy', label: 'سياسة الخصوصية' },
      { href: '/terms',   label: 'شروط الاستخدام' },
    ],
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <Link href="/" className="navbar__logo" style={{ marginBottom: '12px', display: 'inline-flex' }}>
            <span className="navbar__logo-icon">⬡</span>
            <span className="navbar__logo-text" style={{ fontSize: '1.3rem' }}>
              بنك <span className="gradient-text">الدروس</span>
            </span>
          </Link>
          <p className="footer__tagline">
            مستودع رقمي ذكي يجمع كل ما تحتاجه<br />للتعلم في مكان واحد.
          </p>
          <div className="footer__social">
            {['𝕏', 'in', 'ig'].map(icon => (
              <a key={icon} href="#" className="footer__social-btn glass glass-hover">
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(links).map(([category, items]) => (
          <div key={category} className="footer__col">
            <h4 className="footer__col-title">{category}</h4>
            <ul className="footer__col-list">
              {items.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="footer__col-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {year} بنك الدروس. جميع الحقوق محفوظة.
        </p>
        <p className="footer__made">
          صُنع بـ <span style={{ color: '#7c5cfc' }}>♥</span> للطلاب العرب
        </p>
      </div>
    </footer>
  )
}
