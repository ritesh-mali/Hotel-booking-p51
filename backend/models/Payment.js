import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Please associate a booking with the payment'],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please associate a customer with the payment'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the payment amount'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please specify the payment method'],
    },
    transactionId: {
      type: String,
      required: [true, 'Please specify the transaction ID'],
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
