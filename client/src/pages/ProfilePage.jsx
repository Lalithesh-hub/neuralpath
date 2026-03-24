import { useState } from 'react'
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, ArrowLeft, Camera, Trophy, BookOpen, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import api from '../api/axios.js'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, hydrate } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch('/auth/profile', {
        name: form.name,
        phone: form.phone,
        ...(form.newPassword ? { currentPassword: form.currentPassword, newPassword: form.newPassword } : {})
      })
      await hydrate()
      toast.success('Profile updated successfully! ✅')
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 5% 4rem', background: 'radial-gradient(ellipse at top, #060d1f 0%, #020408 80%)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#3d4f6b', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2.5rem' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#3d4f6b'}>
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#3d4f6b', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Account</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff' }}>
            My <span style={{ background: 'linear-gradient(90deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', flexWrap: 'wrap' }}>

          {/* LEFT: Avatar + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Avatar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.2rem' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', border: '3px solid rgba(255,255,255,0.1)' }}>
                  {initials}
                </div>
                <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#00d4ff', border: '2px solid #020408', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => toast('Avatar upload coming soon!', { icon: '📸' })}>
                  <Camera size={12} color="#000" />
                </button>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#3d4f6b' }}>{user?.email}</div>
              <div style={{ marginTop: '0.8rem', display: 'inline-block', fontSize: '0.72rem', padding: '0.2rem 0.8rem', borderRadius: 100, background: 'rgba(6,255,165,0.08)', color: '#06ffa5', border: '1px solid rgba(6,255,165,0.2)', fontWeight: 700 }}>
                {user?.role === 'ADMIN' ? '⚡ Admin' : '🎓 Learner'}
              </div>
            </div>

            {/* Stats */}
            {[
              { Icon: Flame, label: 'Day Streak', val: '3', color: '#f97316' },
              { Icon: Trophy, label: 'Arena Points', val: '32', color: '#fbbf24' },
              { Icon: BookOpen, label: 'Courses Enrolled', val: '—', color: '#00d4ff' },
            ].map(({ Icon, label, val, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '0.72rem', color: '#3d4f6b', marginTop: '0.1rem' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Edit Form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Personal Info */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.2rem' }}>Personal Information</h3>
              {[
                { icon: User,  key: 'name',  label: 'Full Name',  type: 'text',  placeholder: 'Your full name' },
                { icon: Mail,  key: 'email', label: 'Email',      type: 'email', placeholder: 'you@example.com', disabled: true },
                { icon: Phone, key: 'phone', label: 'Phone',      type: 'tel',   placeholder: '+91 98765 43210' },
              ].map(({ icon: Icon, key, label, type, placeholder, disabled }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4b5d7a', marginBottom: '0.4rem' }}>{label} {disabled && <span style={{ color: '#2d3748', fontSize: '0.7rem' }}>(cannot be changed)</span>}</label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3d4f6b' }} />
                    <input className="input" type={type} value={form[key]} disabled={disabled} placeholder={placeholder}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ paddingLeft: '2.5rem', background: disabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', opacity: disabled ? 0.5 : 1 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Change Password */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.2rem' }}>Change Password <span style={{ fontSize: '0.75rem', color: '#3d4f6b', fontWeight: 400 }}>(leave blank to keep current)</span></h3>
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                { key: 'newPassword',     label: 'New Password',     placeholder: 'Min 8 characters' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4b5d7a', marginBottom: '0.4rem' }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3d4f6b' }} />
                    <input className="input" type={showPw ? 'text' : 'password'} value={form[key]} placeholder={placeholder}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: 'rgba(255,255,255,0.03)' }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3d4f6b' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', opacity: saving ? 0.7 : 1 }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
