// src/routes/courses.js
import { Router } from 'express'
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = Router()

router.get('/',        getCourses)                             // public
router.get('/:slug',   getCourse)                             // public
router.post('/',       protect, restrictTo('ADMIN'), createCourse)
router.patch('/:id',   protect, restrictTo('ADMIN'), updateCourse)
router.delete('/:id',  protect, restrictTo('ADMIN'), deleteCourse)

export default router
