import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Please associate a room with a branch'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Please add a room number'],
    },
    roomType: {
      type: String,
      required: [true, 'Please specify a room type'],
      enum: ['Standard', 'Deluxe', 'Suite', 'Family'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a nightly price rate'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add maximum guest capacity'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure roomNumber is unique inside a single branch
roomSchema.index({ branchId: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;
