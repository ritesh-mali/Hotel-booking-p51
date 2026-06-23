import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please associate a customer with the booking'],
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Please associate a branch location with the booking'],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Please select a room for the booking'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please add check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please add check-out date'],
    },
    guests: {
      type: Number,
      required: [true, 'Please add guest count'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please specify total booking charge'],
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
