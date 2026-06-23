import express from 'express';
import { processPayment, getAllPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Process payment (Customer only)
router.post('/process', protect, authorize('customer'), processPayment);

// Get all payments (Admin only)
router.get('/', protect, authorize('admin'), getAllPayments);

export default router;
