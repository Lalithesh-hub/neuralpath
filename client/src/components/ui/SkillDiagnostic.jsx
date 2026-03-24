import { useState } from 'react'

export default function SkillDiagnostic() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  
  const questions = [
    { q: 'What is your current coding level?', opts: ['Absolute Beginner', 'Know some Basics', 'Experienced Dev'] },
    { q: 'What is your main goal?', opts: ['Get a Job / Career Shift', 'Build AI Products', 'Just Curious'] },
    { q: 'How much time can you commit?', opts: ['2-4 hours/week', '10+ hours/week', 'Full-time Bootcamp'] }
  ]

  if (step >= questions.length) {
    let rec = 'Advanced Machine Learning'
    if (answers[0] === 'Absolute Beginner') rec = 'Python for Data Science'
    if (answers[1] === 'Build AI Products') rec = 'AI Application Architect'

    return (
      <div className="card animate-fade-up" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))', border: '1px solid rgba(0,212,255,0.4)', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }}>🎯</div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>Your Perfect Match:<br/><span className="gradient-text">{rec}</span></h3>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>Based on your answers, we recommend jumping straight into this track. It aligns perfectly with your goals and experience.</p>
        <button onClick={() => setStep(0)} className="btn-ghost" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Retake Quiz</button>
      </div>
    )
  }

  const handleAnswer = (opt) => {
    setAnswers({ ...answers, [step]: opt })
    setStep(s => s + 1)
  }

  const cur = questions[step]

  return (
    <div className="card" style={{ padding: '2.5rem', border: '1px solid rgba(0,212,255,0.2)', maxWidth: 600, margin: '0 auto', transition: 'all 0.3s' }}>
      <div className="label-tag" style={{ justifySelf: 'flex-start', marginBottom: '1.2rem' }}>Find Your Path • Step {step + 1} of 3</div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', fontFamily: 'Outfit, sans-serif', color: '#e8eaf6' }}>{cur.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {cur.opts.map((o, i) => (
           <button 
             key={o} 
             onClick={() => handleAnswer(o)} 
             className="btn-ghost" 
             style={{ justifyContent: 'flex-start', padding: '1rem 1.5rem', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.08)', animation: `fadeUp 0.3s ${i * 0.1}s both` }}
           >
             {o}
           </button>
        ))}
      </div>
    </div>
  )
}
