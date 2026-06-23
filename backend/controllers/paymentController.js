import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// @desc    Process a mock payment for a booking
// @route   POST /api/payment/process
// @access  Private (Customer)
export const processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod, transactionId } = req.body;

    if (!bookingId || !paymentMethod || !transactionId) {
      res.statusCode = 400;
      throw new Error('Please provide bookingId, paymentMethod, and transactionId');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.statusCode = 404;
      throw new Error('Booking not found');
    }

    // Verify booking belongs to the current user
    if (booking.customerId.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to process payment for this booking');
    }

    if (booking.paymentStatus === 'paid') {
      res.statusCode = 400;
      throw new Error('This booking is already paid');
    }

    // Create payment record
    const payment = await Payment.create({
      bookingId,
      customerId: req.user._id,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId,
      paymentStatus: 'completed',
    });

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment processed and booking confirmed successfully',
      payment,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/admin/payments
// @access  Private (Admin)
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('customerId', 'name email phone')
      .populate({
        path: 'bookingId',
        populate: {
          path: 'roomId',
          select: 'roomNumber roomType',
        },
      })
      .sort('-createdAt');

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
