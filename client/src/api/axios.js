import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', headers: { 'Content-Type': 'application/json' } })

console.log('🌐 API Base URL:', api.defaults.baseURL)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false, failedQueue = []
const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

api.interceptors.response.use(
  r => r,
  async (error) => {
    const orig = error.config
    if (error.response?.status === 401 && !orig._retry) {
      if (isRefreshing) return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
        .then(t => { orig.headers.Authorization = `Bearer ${t}`; return api(orig) })
      orig._retry = true; isRefreshing = true
      try {
        const rt = localStorage.getItem('refreshToken')
        if (!rt) throw new Error('No refresh token')
        const { data } = await axios.post('/api/auth/refresh', { refreshToken: rt })
        const t = data.data.accessToken
        localStorage.setItem('accessToken', t)
        processQueue(null, t)
        orig.headers.Authorization = `Bearer ${t}`
        return api(orig)
      } catch (e) {
        processQueue(e, null)
        localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(e)
      } finally { isRefreshing = false }
    }
    return Promise.reject(error)
  }
)

export default api
