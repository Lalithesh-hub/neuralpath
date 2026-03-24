// src/routes/bookings.js
import { Router } from 'express'
import { initiateBooking, getMyBookings } from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/',   protect, initiateBooking)
router.get('/my',  protect, getMyBookings)

export default router
