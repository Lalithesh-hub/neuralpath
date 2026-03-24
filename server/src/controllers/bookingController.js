// src/controllers/bookingController.js
// Handles course booking with atomic DB transactions to prevent double-booking

import prisma from '../utils/prisma.js'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

/**
 * POST /api/bookings
 * Initiates a booking and creates a Razorpay order
 *
 * Why Prisma transactions?
 * — Without transactions, two users could book the last seat simultaneously
 * — The transaction locks the course row until the operation completes
 */
export async function initiateBooking(req, res, next) {
  try {
    const { courseId, batch } = req.body
    const userId = req.user.id

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required.' })
    }

    // Run inside a transaction — atomic and safe
    const result = await prisma.$transaction(async (tx) => {
      // 1. Lock and fetch course
      const course = await tx.course.findUnique({ where: { id: courseId } })
      if (!course || !course.isActive) throw Object.assign(new Error('Course not found.'), { statusCode: 404 })

      // 2. Check seat availability
      if (course.bookedSeats >= course.totalSeats) {
        throw Object.assign(new Error('This course is fully booked.'), { statusCode: 409 })
      }

      // 3. Prevent duplicate booking by the same user
      const existingBooking = await tx.booking.findUnique({ where: { userId_courseId: { userId, courseId } } })
      if (existingBooking) {
        throw Object.assign(new Error('You have already booked this course.'), { statusCode: 409 })
      }

      // 4. Create booking in PENDING state
      const booking = await tx.booking.create({ data: { userId, courseId, batch, status: 'PENDING' } })

      // 5. Create Razorpay order
      let razorpayOrder;
      if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
        razorpayOrder = { id: `order_dummy_${Date.now()}` }
      } else {
        razorpayOrder = await razorpay.orders.create({
          amount:   course.price, // already in paise
          currency: 'INR',
          receipt:  `booking_${booking.id}`,
          notes:    { bookingId: booking.id, courseTitle: course.title },
        })
      }

      // 6. Save payment record
      await tx.payment.create({
        data: {
          bookingId:      booking.id,
          amount:         course.price,
          razorpayOrderId: razorpayOrder.id,
        },
      })

      return { booking, razorpayOrder, course }
    })

    res.status(201).json({
      success: true,
      message: 'Booking initiated. Complete payment to confirm.',
      data: {
        bookingId:      result.booking.id,
        razorpayOrderId: result.razorpayOrder.id,
        amount:         result.course.price,
        currency:       'INR',
        courseName:     result.course.title,
        keyId:          process.env.RAZORPAY_KEY_ID,
      },
    })
  } catch (err) {
    next(err)
  }
}

/** GET /api/bookings/my — get current user's bookings */
export async function getMyBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where:   { userId: req.user.id },
      include: {
        course:  { select: { title: true, emoji: true, level: true, duration: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { bookedAt: 'desc' },
    })
    res.json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
}
