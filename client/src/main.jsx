import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background:'#080f1f', color:'#e8eaf6', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', fontFamily:"'DM Sans', sans-serif" },
          success: { iconTheme: { primary:'#06ffa5', secondary:'#080f1f' } },
          error:   { iconTheme: { primary:'#f87171', secondary:'#080f1f' } },
        }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
