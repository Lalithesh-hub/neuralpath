import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Github, Youtube, Zap } from 'lucide-react'

const LINKS = {
  Product: [['/', 'Home'], ['/courses', 'Courses'], ['/architect', 'Career Architect'], ['/arena', 'Interview Arena']],
  Company:  [['#', 'About Us'], ['#', 'Blog'], ['#', 'Careers'], ['#', 'Contact']],
  Legal:    [['#', 'Privacy Policy'], ['#', 'Terms of Service'], ['#', 'Cookie Policy']],
}

const SOCIALS = [
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Github, href: '#', label: 'GitHub' },
]

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2,4,8,0.95)', backdropFilter: 'blur(20px)', padding: '4rem 5% 2rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, 1fr)', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {/* Brand Column */}
          <div style={{ minWidth: 220 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06ffa5', display: 'inline-block', boxShadow: '0 0 10px #06ffa5' }} />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#00d4ff' }}>NeuralPath</span>
            </Link>
            <p style={{ color: '#3d4f6b', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 220 }}>
              India's premier AI-powered learning platform. Shaping the next generation of tech talent.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} title={label}
                  style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3d4f6b', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#3d4f6b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4b5d7a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>{heading}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {items.map(([href, label]) => (
                  <li key={label}>
                    <Link to={href} style={{ color: '#3d4f6b', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#e2e8f0'} onMouseLeave={e => e.target.style.color = '#3d4f6b'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.3rem' }}>Get AI & Career Tips Weekly</div>
            <div style={{ fontSize: '0.82rem', color: '#3d4f6b' }}>Join 5,000+ professionals. No spam, ever.</div>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <input placeholder="Enter your email" type="email" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem 1rem', color: '#fff', outline: 'none', fontSize: '0.85rem', minWidth: 220 }} />
            <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
              <Zap size={14} /> Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ color: '#2d3748', fontSize: '0.8rem' }}>© {new Date().getFullYear()} NeuralPath. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {['SOC 2', 'GDPR', 'ISO 27001'].map(b => (
              <span key={b} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: 100, border: '1px solid rgba(255,255,255,0.08)', color: '#2d3748', fontWeight: 600, letterSpacing: '0.05em' }}>{b}</span>
            ))}
          </div>
          <p style={{ color: '#2d3748', fontSize: '0.8rem' }}>Made with 💙 in India · Powered by AI</p>
        </div>
      </div>
    </footer>
  )
}
