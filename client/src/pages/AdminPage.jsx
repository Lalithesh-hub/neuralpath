import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, DollarSign, TrendingUp, RefreshCw } from 'lucide-react'
import api from '../api/axios.js'

const TABS = ['Overview', 'Bookings', 'Students']

const STATUS_COLOR = {
  PENDING:   '#fbbf24', CONFIRMED: '#06ffa5',
  CANCELLED: '#f87171', COMPLETED: '#00d4ff',
}

export default function AdminPage() {
  const [tab, setTab] = useState('Overview')

  const { data: stats, isLoading: sLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data.data),
  })

  const { data: bookings = [], isLoading: bLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => api.get('/admin/bookings').then(r => r.data.data),
    enabled: tab === 'Bookings',
  })

  const { data: users = [], isLoading: uLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data.data),
    enabled: tab === 'Students',
  })

  const statCards = stats ? [
    { icon:<Users size={20} color="#00d4ff"/>,     label:'Total Students',  val: stats.totalUsers,       bg:'rgba(0,212,255,0.06)',   border:'rgba(0,212,255,0.2)'   },
    { icon:<BookOpen size={20} color="#7c3aed"/>,  label:'Total Bookings',  val: stats.totalBookings,    bg:'rgba(124,58,237,0.06)', border:'rgba(124,58,237,0.2)' },
    { icon:<TrendingUp size={20} color="#06ffa5"/>,label:'Confirmed',       val: stats.confirmedBookings,bg:'rgba(6,255,165,0.06)',   border:'rgba(6,255,165,0.2)'  },
    { icon:<DollarSign size={20} color="#fbbf24"/>,label:'Revenue (₹)',     val: `₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`, bg:'rgba(251,191,36,0.06)', border:'rgba(251,191,36,0.2)' },
  ] : []

  return (
    <div style={{ minHeight:'100vh', padding:'6rem 5% 3rem' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:'2rem' }}>
          <div className="label-tag" style={{ marginBottom:'0.5rem' }}>Admin Panel</div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>
            NeuralPath <span className="gradient-text">Dashboard</span>
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2rem', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'0' }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:'0.6rem 1.2rem', background:'none', border:'none', cursor:'pointer',
              fontSize:'0.9rem', fontWeight:600, color: tab===t?'#00d4ff':'#6b7a99',
              borderBottom: tab===t?'2px solid #00d4ff':'2px solid transparent',
              marginBottom:'-1px', transition:'all 0.2s',
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab==='Overview' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
              {sLoading ? [1,2,3,4].map(i=><div key={i} className="card" style={{ height:100 }}/>) :
                statCards.map(s=>(
                  <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:16, padding:'1.4rem', display:'flex', gap:'1rem', alignItems:'center' }}>
                    {s.icon}
                    <div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.7rem', lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:'0.78rem', color:'#6b7a99', marginTop:'0.2rem' }}>{s.label}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="card" style={{ padding:'2rem', textAlign:'center', color:'#6b7a99' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.8rem' }}>📊</div>
              <p style={{ fontSize:'0.9rem' }}>Switch to <strong style={{ color:'#e8eaf6' }}>Bookings</strong> or <strong style={{ color:'#e8eaf6' }}>Students</strong> tabs for detailed data.</p>
            </div>
          </>
        )}

        {/* BOOKINGS TAB */}
        {tab==='Bookings' && (
          <div style={{ overflowX:'auto' }}>
            {bLoading ? <div style={{ color:'#6b7a99', textAlign:'center', padding:'3rem' }}>Loading bookings…</div> : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Student','Course','Status','Amount','Date'].map(h=>(
                      <th key={h} style={{ textAlign:'left', padding:'0.75rem 1rem', color:'#6b7a99', fontWeight:600, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b=>(
                    <tr key={b.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'0.85rem 1rem' }}>
                        <div style={{ fontWeight:600 }}>{b.user?.name}</div>
                        <div style={{ fontSize:'0.76rem', color:'#6b7a99' }}>{b.user?.email}</div>
                      </td>
                      <td style={{ padding:'0.85rem 1rem' }}>{b.course?.emoji} {b.course?.title}</td>
                      <td style={{ padding:'0.85rem 1rem' }}>
                        <span style={{ background:`${STATUS_COLOR[b.status]}20`, color:STATUS_COLOR[b.status], fontSize:'0.72rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:100 }}>{b.status}</span>
                      </td>
                      <td style={{ padding:'0.85rem 1rem', color:'#00d4ff', fontWeight:600 }}>
                        {b.payment ? `₹${(b.payment.amount/100).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding:'0.85rem 1rem', color:'#6b7a99' }}>{new Date(b.bookedAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab==='Students' && (
          <div style={{ overflowX:'auto' }}>
            {uLoading ? <div style={{ color:'#6b7a99', textAlign:'center', padding:'3rem' }}>Loading students…</div> : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Name','Email','Phone','Bookings','Joined'].map(h=>(
                      <th key={h} style={{ textAlign:'left', padding:'0.75rem 1rem', color:'#6b7a99', fontWeight:600, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'0.85rem 1rem', fontWeight:600 }}>{u.name}</td>
                      <td style={{ padding:'0.85rem 1rem', color:'#6b7a99' }}>{u.email}</td>
                      <td style={{ padding:'0.85rem 1rem', color:'#6b7a99' }}>{u.phone || '—'}</td>
                      <td style={{ padding:'0.85rem 1rem' }}>
                        <span style={{ background:'rgba(0,212,255,0.1)', color:'#00d4ff', fontSize:'0.8rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:100 }}>{u._count?.bookings || 0}</span>
                      </td>
                      <td style={{ padding:'0.85rem 1rem', color:'#6b7a99' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
