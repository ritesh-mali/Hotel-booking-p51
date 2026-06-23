import express from 'express';
import {
  getManagerDashboard,
  getManagerRooms,
  createManagerRoom,
  updateManagerRoom,
  deleteManagerRoom,
  getManagerOccupancy
} from '../controllers/branchManagerController.js';
import { getBranchBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth and manager role check to all routes
router.use(protect);
router.use(authorize('branchManager'));

router.get('/dashboard', getManagerDashboard);
router.get('/rooms', getManagerRooms);
router.post('/room', createManagerRoom);
router.put('/room/:id', updateManagerRoom);
router.delete('/room/:id', deleteManagerRoom);
router.get('/bookings', getBranchBookings);
router.get('/occupancy', getManagerOccupancy);

export default router;
