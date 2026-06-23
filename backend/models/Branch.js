import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: [true, 'Please add a branch name'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add a physical address'],
    },
    description: {
      type: String,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
