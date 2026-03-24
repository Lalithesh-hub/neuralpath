// src/middleware/errorHandler.js
// Centralised error handler — catches all errors thrown via next(err)

/**
 * Why centralised error handling?
 * — Consistent error response shape across all routes
 * — Single place to log errors
 * — Prevents leaking stack traces in production
 */
export function errorHandler(err, req, res, next) {
  // Default to 500 if no status code set
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Only log full stack in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ [${req.method}] ${req.path} →`, err)
  } else {
    console.error(`❌ ${statusCode} ${message}`)
  }

  // Handle Prisma unique constraint violations (e.g. duplicate email)
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: `${err.meta?.target?.join(', ')} already exists.`,
    })
  }

  // Handle Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' })
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * createError — convenience factory for operational errors
 * Usage: throw createError(400, 'Invalid input')
 */
export function createError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}
