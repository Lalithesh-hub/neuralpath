import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter } from 'lucide-react'
import api from '../api/axios.js'
import CourseCard from '../components/ui/CourseCard.jsx'

const LEVELS = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [level, setLevel]   = useState('All')

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses', search, level],
    queryFn: () => api.get('/courses', { params: { search: search || undefined, level: level === 'All' ? undefined : level } }).then(r => r.data.data),
    keepPreviousData: true,
  })

  return (
    <div style={{ paddingTop: '6rem', minHeight: '100vh', padding:'6rem 5% 4rem' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div className="label-tag" style={{ justifyContent:'center', marginBottom:'0.8rem' }}>All Courses</div>
          <h1 className="section-title" style={{ fontSize:'clamp(2rem,5vw,3.2rem)', marginBottom:'1rem' }}>Find Your Perfect <span className="gradient-text">Learning Path</span></h1>
          <p style={{ color:'#6b7a99', maxWidth:480, margin:'0 auto' }}>From complete beginner to job-ready professional — we have a course for every stage.</p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:'1rem', marginBottom:'2.5rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#6b7a99' }}/>
            <input className="input" style={{ paddingLeft:'2.4rem' }} placeholder="Search courses…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            {LEVELS.map(l => (
              <button key={l} onClick={()=>setLevel(l)} style={{
                padding:'0.5rem 1rem', borderRadius:100, fontSize:'0.8rem', fontWeight:600, cursor:'pointer', border:'1px solid', transition:'all 0.2s',
                background: level===l ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'transparent',
                borderColor: level===l ? 'transparent' : 'rgba(255,255,255,0.1)',
                color: level===l ? '#fff' : '#6b7a99',
              }}>{l === 'All' ? 'All Levels' : l.charAt(0)+l.slice(1).toLowerCase()}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {[1,2,3,4,5,6].map(i=><div key={i} className="card" style={{ height:280, background:'rgba(255,255,255,0.02)' }}/>)}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#6b7a99' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
            <p>No courses found. Try a different search.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
            {courses.map((c,i)=><CourseCard key={c.id} course={c} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
