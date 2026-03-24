// src/api/services.js
// All API calls in one place — easy to maintain and mock in tests

import api from './axios.js'

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  logout:   (data)  => api.post('/auth/logout', data),
  getMe:    ()      => api.get('/auth/me'),
}

// ─── COURSES ─────────────────────────────────────────────────────────────────
export const coursesAPI = {
  getAll:   (params) => api.get('/courses', { params }),
  getOne:   (slug)   => api.get(`/courses/${slug}`),
  create:   (data)   => api.post('/courses', data),
  update:   (id, d)  => api.patch(`/courses/${id}`, d),
  delete:   (id)     => api.delete(`/courses/${id}`),
}

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  initiate: (courseId) => api.post('/bookings', { courseId }),
  getMine:  ()         => api.get('/bookings/my'),
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  verify: (data) => api.post('/payments/verify', data),
}

// ─── CHAT ────────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (message, history) => api.post('/chat', { message, history }),
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:    () => api.get('/admin/stats'),
  getBookings: () => api.get('/admin/bookings'),
  getUsers:    () => api.get('/admin/users'),
}
