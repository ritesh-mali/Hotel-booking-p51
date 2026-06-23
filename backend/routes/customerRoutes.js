import express from 'express';
import {
  getBranches,
  getBranchById,
  getRoomsByBranch
} from '../controllers/customerController.js';
import {
  createBooking,
  getCustomerBookings,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes for browsing
router.get('/branches', getBranches);
router.get('/branches/:id', getBranchById);
router.get('/rooms/:branchId', getRoomsByBranch);

// Protected routes (Customer only)
router.post('/book-room', protect, authorize('customer'), createBooking);
router.get('/bookings', protect, authorize('customer'), getCustomerBookings);
router.put('/cancel-booking/:id', protect, authorize('customer'), cancelBooking);

export default router;
