const prisma = require('../config/db');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Get available mentor slots
const getMentorSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { date } = req.query;

    // Check if mentor exists
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId, role: 'MENTOR' }
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Get existing bookings for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        mentorId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    // Generate available slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      const isBooked = existingBookings.some(booking => 
        booking.date.getHours() === hour
      );
      
      if (!isBooked) {
        availableSlots.push(slotTime);
      }
    }

    res.json({
      success: true,
      data: { availableSlots }
    });
  } catch (error) {
    console.error('Get mentor slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentor slots'
    });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { mentorId, date, notes } = req.body;

    // Check if mentor exists
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId, role: 'MENTOR' },
      select: { id: true, name: true, email: true }
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        mentorId,
        date: new Date(date),
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const booking = await prisma.booking.create({
      data: {
        mentorId,
        menteeId: req.user.id,
        date: new Date(date),
        notes,
        status: 'PENDING'
      },
      include: {
        mentor: {
          select: { id: true, name: true, email: true }
        },
        mentee: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create notification for mentor
    await prisma.notification.create({
      data: {
        userId: mentorId,
        type: 'BOOKING_CONFIRMED',
        title: 'New Booking Request',
        message: `${req.user.name} has requested a mentorship session with you.`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

// Get user bookings
const getBookings = async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    if (type === 'mentor') {
      where.mentorId = req.user.id;
    } else if (type === 'mentee') {
      where.menteeId = req.user.id;
    } else {
      where.OR = [
        { mentorId: req.user.id },
        { menteeId: req.user.id }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'asc' },
        include: {
          mentor: {
            select: { id: true, name: true, avatar: true }
          },
          mentee: {
            select: { id: true, name: true, avatar: true }
          }
        }
      }),
      prisma.booking.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

// Update booking status
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        mentee: { select: { id: true, name: true, email: true } }
      }
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only mentor can confirm/cancel bookings
    if (existingBooking.mentorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentor can update booking status'
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        mentor: { select: { id: true, name: true, avatar: true } },
        mentee: { select: { id: true, name: true, avatar: true } }
      }
    });

    // Create notification for mentee
    await prisma.notification.create({
      data: {
        userId: existingBooking.menteeId,
        type: status === 'CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED',
        title: `Booking ${status.toLowerCase()}`,
        message: `Your mentorship session with ${existingBooking.mentor.name} has been ${status.toLowerCase()}.`
      }
    });

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      data: { booking: updatedBooking }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

module.exports = {
  getMentorSlots,
  createBooking,
  getBookings,
  updateBooking,
};