// src/controllers/courseController.js
import { z } from 'zod'
import prisma from '../utils/prisma.js'

const courseSchema = z.object({
  title:       z.string().min(4).max(100),
  slug:        z.string().min(3).max(80),
  description: z.string().min(10).max(300),
  longDesc:    z.string().optional(),
  price:       z.number().int().positive(), // in paise
  level:       z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  category:    z.string().min(2).max(60),
  emoji:       z.string().optional(),
  totalSeats:  z.number().int().positive().default(30),
  duration:    z.string().min(2).max(30),
})

/** GET /api/courses — public, lists all active courses */
export async function getCourses(req, res, next) {
  try {
    const { level, category, search } = req.query

    const where = {
      isActive: true,
      ...(level    && { level }),
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...(search   && {
        OR: [
          { title:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, title: true, slug: true, description: true,
        price: true, level: true, category: true, emoji: true,
        totalSeats: true, bookedSeats: true, duration: true,
      },
    })

    // Calculate availability percentage for each course
    const data = courses.map(c => ({
      ...c,
      availableSeats: c.totalSeats - c.bookedSeats,
      isFull: c.bookedSeats >= c.totalSeats,
      priceInRupees: c.price / 100,
    }))

    res.json({ success: true, count: data.length, data })
  } catch (err) {
    next(err)
  }
}

/** GET /api/courses/:slug — public, single course detail */
export async function getCourse(req, res, next) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
    })
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' })
    res.json({ success: true, data: { ...course, priceInRupees: course.price / 100 } })
  } catch (err) {
    next(err)
  }
}

/** POST /api/courses — admin only */
export async function createCourse(req, res, next) {
  try {
    const result = courseSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors })
    }
    const course = await prisma.course.create({ data: result.data })
    res.status(201).json({ success: true, data: course })
  } catch (err) {
    next(err)
  }
}

/** PATCH /api/courses/:id — admin only */
export async function updateCourse(req, res, next) {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ success: true, data: course })
  } catch (err) {
    next(err)
  }
}

/** DELETE /api/courses/:id — admin only (soft delete) */
export async function deleteCourse(req, res, next) {
  try {
    await prisma.course.update({ where: { id: req.params.id }, data: { isActive: false } })
    res.json({ success: true, message: 'Course deactivated.' })
  } catch (err) {
    next(err)
  }
}
