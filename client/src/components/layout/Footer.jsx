// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-np-border bg-np-bg2 mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg text-np-accent">
          <span className="w-2 h-2 rounded-full bg-np-green animate-pulse-slow" />
          NeuralPath
        </Link>
        <div className="flex gap-6 flex-wrap justify-center">
          {[['/', 'Home'], ['/courses', 'Courses'], ['/login', 'Login'], ['/register', 'Enroll']].map(([to, label]) => (
            <Link key={to} to={to} className="text-np-muted hover:text-np-accent text-sm transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-np-muted text-xs">© {new Date().getFullYear()} NeuralPath. All rights reserved.</p>
      </div>
    </footer>
  )
}
