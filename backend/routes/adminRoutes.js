import express from 'express';
import {
  createBranch,
  updateBranch,
  deleteBranch,
  getAdminBranches,
  createRoom,
  updateRoom,
  deleteRoom,
  getAdminRooms,
  getReports
} from '../controllers/adminController.js';
import { getAllBookings } from '../controllers/bookingController.js';
import { getAllPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply authentication and role check middleware for all admin routes
router.use(protect);
router.use(authorize('admin'));

// Branch CRUD
router.post('/branch', createBranch);
router.put('/branch/:id', updateBranch);
router.delete('/branch/:id', deleteBranch);
router.get('/branches', getAdminBranches);

// Room CRUD
router.post('/room', createRoom);
router.put('/room/:id', updateRoom);
router.delete('/room/:id', deleteRoom);
router.get('/rooms', getAdminRooms);

// Bookings & Payments ledgers
router.get('/bookings', getAllBookings);
router.get('/payments', getAllPayments);

// Analytical reports dashboard
router.get('/reports', getReports);

export default router;
