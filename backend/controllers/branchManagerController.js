import Branch from '../models/Branch.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// Helper to check if manager owns the branch/room
const checkBranchAssociation = (req, res) => {
  if (!req.user || req.user.role !== 'branchManager') {
    res.statusCode = 403;
    throw new Error('Access denied: User is not a branch manager');
  }
  if (!req.user.branchId) {
    res.statusCode = 400;
    throw new Error('Manager is not associated with any branch');
  }
  return req.user.branchId.toString();
};

// @desc    Get branch manager dashboard stats
// @route   GET /api/manager/dashboard
// @access  Private (Branch Manager)
export const getManagerDashboard = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);

    const branch = await Branch.findById(branchId);
    if (!branch) {
      res.statusCode = 404;
      throw new Error('Associated branch not found');
    }

    const totalRooms = await Room.countDocuments({ branchId });
    const availableRooms = await Room.countDocuments({ branchId, isAvailable: true });
    
    // Active bookings today
    const today = new Date();
    const activeBookingsToday = await Booking.find({
      branchId,
      bookingStatus: { $ne: 'cancelled' },
      checkInDate: { $lte: today },
      checkOutDate: { $gte: today }
    });
    const occupiedRoomsCount = activeBookingsToday.length;

    // Total bookings count
    const totalBookings = await Booking.countDocuments({ branchId });

    // Branch Revenue
    const branchRevenueResult = await Booking.aggregate([
      { $match: { branchId: branch._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = branchRevenueResult[0]?.total || 0;

    res.json({
      success: true,
      dashboard: {
        branchName: branch.branchName,
        city: branch.city,
        address: branch.address,
        stats: {
          totalRooms,
          availableRooms,
          occupiedRoomsToday: occupiedRoomsCount,
          totalBookings,
          totalRevenue
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms under managed branch
// @route   GET /api/manager/rooms
// @access  Private (Branch Manager)
export const getManagerRooms = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);
    const rooms = await Room.find({ branchId });
    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room under managed branch
// @route   POST /api/manager/room
// @access  Private (Branch Manager)
export const createManagerRoom = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);
    const { roomNumber, roomType, price, capacity, amenities, images } = req.body;

    if (!roomNumber || !roomType || !price || !capacity) {
      res.statusCode = 400;
      throw new Error('Please enter all required room details');
    }

    const roomExists = await Room.findOne({ branchId, roomNumber });
    if (roomExists) {
      res.statusCode = 400;
      throw new Error(`Room number ${roomNumber} already exists in your branch`);
    }

    const room = await Room.create({
      branchId,
      roomNumber,
      roomType,
      price,
      capacity,
      amenities,
      images
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully in your branch',
      room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room under managed branch
// @route   PUT /api/manager/room/:id
// @access  Private (Branch Manager)
export const updateManagerRoom = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.statusCode = 404;
      throw new Error('Room not found');
    }

    // Verify room belongs to manager's branch
    if (room.branchId.toString() !== branchId) {
      res.statusCode = 403;
      throw new Error('Not authorized to update rooms in other branches');
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room under managed branch
// @route   DELETE /api/manager/room/:id
// @access  Private (Branch Manager)
export const deleteManagerRoom = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.statusCode = 404;
      throw new Error('Room not found');
    }

    if (room.branchId.toString() !== branchId) {
      res.statusCode = 403;
      throw new Error('Not authorized to delete rooms in other branches');
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Room deleted successfully from your branch'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed occupancy stats for managed branch
// @route   GET /api/manager/occupancy
// @access  Private (Branch Manager)
export const getManagerOccupancy = async (req, res, next) => {
  try {
    const branchId = checkBranchAssociation(req, res);

    const totalRoomsCount = await Room.countDocuments({ branchId });
    
    // Find all active bookings overlapping right now
    const today = new Date();
    const activeBookingsToday = await Booking.find({
      branchId,
      bookingStatus: { $ne: 'cancelled' },
      checkInDate: { $lte: today },
      checkOutDate: { $gte: today }
    })
      .populate('roomId', 'roomNumber roomType price')
      .populate('customerId', 'name email phone');

    const occupiedRoomIds = activeBookingsToday.map(b => b.roomId?._id?.toString());
    const occupancyPercentage = totalRoomsCount > 0 ? (occupiedRoomIds.length / totalRoomsCount) * 100 : 0;

    res.json({
      success: true,
      occupancy: {
        totalRooms: totalRoomsCount,
        occupiedRoomsCount: activeBookingsToday.length,
        occupancyPercentage: Math.round(occupancyPercentage * 100) / 100,
        activeBookings: activeBookingsToday.map(booking => ({
          bookingId: booking._id,
          roomNumber: booking.roomId?.roomNumber,
          roomType: booking.roomId?.roomType,
          guestName: booking.customerId?.name,
          guestEmail: booking.customerId?.email,
          guestPhone: booking.customerId?.phone,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          guestsCount: booking.guests,
          paymentStatus: booking.paymentStatus
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
