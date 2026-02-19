const express = require('express');
const router = express.Router();
const {
  getMentorSlots,
  createBooking,
  getBookings,
  updateBooking,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../utils/validateInputs');
const { z } = require('zod');

// Validation schemas
const createBookingSchema = z.object({
  mentorId: z.string().uuid('Invalid mentor ID'),
  date: z.string().datetime('Invalid date format'),
  notes: z.string().max(500).optional(),
});

const updateBookingSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED']),
});

// Booking routes
router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, validate(createBookingSchema), createBooking);
router.put('/:id', authMiddleware, validate(updateBookingSchema), updateBooking);

// Mentor slots routes
router.get('/mentors/:mentorId/slots', authMiddleware, getMentorSlots);

module.exports = router;