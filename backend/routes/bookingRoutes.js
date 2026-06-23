import express from 'express';
import {
  createBooking,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication to all booking routes
router.use(protect);

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

export default router;
