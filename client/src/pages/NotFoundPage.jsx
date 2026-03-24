import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      
      {/* Glitch Number */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1, background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', userSelect: 'none', letterSpacing: '-0.05em' }}>
          404
        </div>
        <div style={{ position: 'absolute', inset: 0, fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', opacity: 0.6, animation: 'glitch 3s infinite', letterSpacing: '-0.05em', pointerEvents: 'none' }}>
          404
        </div>
      </div>

      {/* Terminal Box */}
      <div style={{ background: 'rgba(8,15,31,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, padding: '2rem 2.5rem', marginBottom: '2.5rem', maxWidth: 480, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.2rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#06ffa5' }} />
        </div>
        <div style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.85rem', color: '#4b5d7a', lineHeight: 2, textAlign: 'left' }}>
          <div><span style={{ color: '#06ffa5' }}>nura@neuralpath</span>:<span style={{ color: '#00d4ff' }}>~</span>$ cd {window.location.pathname}</div>
          <div style={{ color: '#ef4444' }}>bash: cd: {window.location.pathname}: No such file or directory</div>
          <div><span style={{ color: '#06ffa5' }}>nura@neuralpath</span>:<span style={{ color: '#00d4ff' }}>~</span>$ <span style={{ animation: 'blink 1s infinite', display: 'inline-block' }}>▌</span></div>
        </div>
      </div>

      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.8rem', color: '#fff' }}>
        Page <span style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Not Found</span>
      </h1>
      <p style={{ color: '#4b5d7a', maxWidth: 400, lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
        Looks like Nura couldn't compute a route to this page. Let's get you back on track.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={15} /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={15} /> Go Back
        </button>
        <Link to="/courses" className="btn-ghost" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={15} /> Browse Courses
        </Link>
      </div>

      <style>{`
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0, 0) skew(0deg); opacity: 0.6; }
          93% { transform: translate(-3px, 1px) skew(-2deg); opacity: 0.4; }
          96% { transform: translate(3px, -1px) skew(1deg); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
