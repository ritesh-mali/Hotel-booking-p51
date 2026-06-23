import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Branch from '../models/Branch.js';

// Helper to check room availability
export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Find overlapping bookings that are confirmed or completed
  const overlappingBooking = await Booking.findOne({
    roomId,
    bookingStatus: { $ne: 'cancelled' },
    $and: [
      { checkInDate: { $lt: checkOut } },
      { checkOutDate: { $gt: checkIn } }
    ]
  });

  return !overlappingBooking;
};

// @desc    Create a new booking
// @route   POST /api/customer/book-room or /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate, guests } = req.body;
    const customerId = req.user._id;

    if (!roomId || !checkInDate || !checkOutDate || !guests) {
      res.statusCode = 400;
      throw new Error('Please provide roomId, checkInDate, checkOutDate, and guests count');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      res.statusCode = 400;
      throw new Error('Check-in date cannot be in the past');
    }

    if (checkOut <= checkIn) {
      res.statusCode = 400;
      throw new Error('Check-out date must be after check-in date');
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      res.statusCode = 404;
      throw new Error('Room not found');
    }

    if (!room.isAvailable) {
      res.statusCode = 400;
      throw new Error('Room is currently set as unavailable by the manager');
    }

    if (guests > room.capacity) {
      res.statusCode = 400;
      throw new Error(`Guest count exceeds room capacity of ${room.capacity}`);
    }

    // Check double booking
    const available = await isRoomAvailable(roomId, checkIn, checkOut);
    if (!available) {
      res.statusCode = 400;
      throw new Error('Room is already booked for the selected dates');
    }

    // Auto-calculate price
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = diffDays * room.price;

    const booking = await Booking.create({
      customerId,
      branchId: room.branchId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Please complete the payment.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/customer/cancel-booking/:id
// @access  Private (Customer or Admin)
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.statusCode = 404;
      throw new Error('Booking not found');
    }

    // Check ownership (only the booking customer or admin or branch manager can cancel)
    if (
      req.user.role === 'customer' &&
      booking.customerId.toString() !== req.user._id.toString()
    ) {
      res.statusCode = 403;
      throw new Error('Not authorized to cancel this booking');
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer booking history
// @route   GET /api/customer/bookings
// @access  Private (Customer)
export const getCustomerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('branchId', 'branchName city address')
      .populate('roomId', 'roomNumber roomType price')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email phone')
      .populate('branchId', 'branchName city')
      .populate('roomId', 'roomNumber roomType')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for a specific branch (Manager only)
// @route   GET /api/manager/bookings
// @access  Private (Branch Manager)
export const getBranchBookings = async (req, res, next) => {
  try {
    if (!req.user.branchId) {
      res.statusCode = 400;
      throw new Error('Manager is not associated with any branch');
    }

    const bookings = await Booking.find({ branchId: req.user.branchId })
      .populate('customerId', 'name email phone')
      .populate('roomId', 'roomNumber roomType')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer, Admin, Manager)
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('branchId', 'branchName city address')
      .populate('roomId', 'roomNumber roomType price');

    if (!booking) {
      res.statusCode = 404;
      throw new Error('Booking not found');
    }

    // Role checks
    if (req.user.role === 'customer' && booking.customerId._id.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to view this booking');
    }

    if (req.user.role === 'branchManager' && booking.branchId._id.toString() !== req.user.branchId.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to view bookings of other branches');
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};
