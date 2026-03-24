// src/routes/admin.js
// Admin-only routes — all protected by ADMIN role check

import { Router } from 'express'
import { protect, restrictTo } from '../middleware/auth.js'
import prisma from '../utils/prisma.js'

const router = Router()

// All admin routes require authentication AND ADMIN role
router.use(protect, restrictTo('ADMIN'))

/** GET /api/admin/stats — dashboard overview */
router.get('/stats', async (req, res, next) => {
  try {
    const [totalUsers, totalBookings, confirmedBookings, totalCourses, revenueData] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.course.count({ where: { isActive: true } }),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum:  { amount: true },
      }),
    ])

    const totalRevenue = (revenueData._sum.amount || 0) / 100 // convert paise to rupees

    res.json({
      success: true,
      data: { totalUsers, totalBookings, confirmedBookings, totalCourses, totalRevenue },
    })
  } catch (err) {
    next(err)
  }
})

/** GET /api/admin/bookings — all bookings with user and course info */
router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user:    { select: { name: true, email: true } },
        course:  { select: { title: true, emoji: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { bookedAt: 'desc' },
      take: 100,
    })
    res.json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
})

/** GET /api/admin/users — all students */
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where:   { role: 'STUDENT' },
      select:  { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: users })
  } catch (err) {
    next(err)
  }
})

export default router
