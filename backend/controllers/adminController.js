import Branch from '../models/Branch.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

// --- Branch Management ---

// @desc    Create a branch & its manager credentials
// @route   POST /api/admin/branch
// @access  Private (Admin)
export const createBranch = async (req, res, next) => {
  try {
    const {
      branchName,
      city,
      address,
      description,
      amenities,
      images,
      managerName,
      managerEmail,
      managerPhone,
      managerPassword,
    } = req.body;

    if (
      !branchName ||
      !city ||
      !address ||
      !managerName ||
      !managerEmail ||
      !managerPhone ||
      !managerPassword
    ) {
      res.statusCode = 400;
      throw new Error('Please enter all required branch and manager details');
    }

    // Verify manager email doesn't exist
    const managerExists = await User.findOne({ email: managerEmail });
    if (managerExists) {
      res.statusCode = 400;
      throw new Error('Manager email already exists as a user');
    }

    // 1. Create manager user (role: 'branchManager')
    const manager = new User({
      name: managerName,
      email: managerEmail,
      phone: managerPhone,
      password: managerPassword,
      role: 'branchManager',
    });

    // 2. Create the branch
    const branch = new Branch({
      branchName,
      city,
      address,
      description,
      amenities,
      images,
      managerId: manager._id,
    });

    // 3. Sync IDs
    manager.branchId = branch._id;

    // Save both
    await manager.save();
    await branch.save();

    res.status(201).json({
      success: true,
      message: 'Branch and Manager credentials created successfully',
      branch,
      manager: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        role: manager.role,
        branchId: manager.branchId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update branch details
// @route   PUT /api/admin/branch/:id
// @access  Private (Admin)
export const updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      res.statusCode = 404;
      throw new Error('Branch not found');
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Branch details updated',
      branch: updatedBranch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete branch & associated manager/rooms
// @route   DELETE /api/admin/branch/:id
// @access  Private (Admin)
export const deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      res.statusCode = 404;
      throw new Error('Branch not found');
    }

    // Delete manager user
    if (branch.managerId) {
      await User.findByIdAndDelete(branch.managerId);
    }

    // Delete rooms belonging to this branch
    await Room.deleteMany({ branchId: branch._id });

    // Delete branch itself
    await Branch.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Branch, associated manager user, and rooms deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all branches
// @route   GET /api/admin/branches
// @access  Private (Admin)
export const getAdminBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().populate('managerId', 'name email phone');
    res.json({
      success: true,
      count: branches.length,
      branches,
    });
  } catch (error) {
    next(error);
  }
};

// --- Room Management ---

// @desc    Create a room
// @route   POST /api/admin/room
// @access  Private (Admin)
export const createRoom = async (req, res, next) => {
  try {
    const { branchId, roomNumber, roomType, price, capacity, amenities, images } = req.body;

    if (!branchId || !roomNumber || !roomType || !price || !capacity) {
      res.statusCode = 400;
      throw new Error('Please enter all required room details');
    }

    // Verify branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      res.statusCode = 404;
      throw new Error('Associated Branch not found');
    }

    // Check unique room number in branch (Mongoose unique index handles this too, but we can do a preemptive check)
    const roomExists = await Room.findOne({ branchId, roomNumber });
    if (roomExists) {
      res.statusCode = 400;
      throw new Error(`Room number ${roomNumber} already exists in this branch`);
    }

    const room = await Room.create({
      branchId,
      roomNumber,
      roomType,
      price,
      capacity,
      amenities,
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room
// @route   PUT /api/admin/room/:id
// @access  Private (Admin)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.statusCode = 404;
      throw new Error('Room not found');
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Room updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/admin/room/:id
// @access  Private (Admin)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.statusCode = 404;
      throw new Error('Room not found');
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms (for admin console)
// @route   GET /api/admin/rooms
// @access  Private (Admin)
export const getAdminRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().populate('branchId', 'branchName city');
    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// --- Reports & Analytics ---

// @desc    Get booking, payment, occupancy dashboard reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res, next) => {
  try {
    // 1. Core overall stats
    const totalRevenueResult = await Payment.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalRooms = await Room.countDocuments();
    const totalBranches = await Branch.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Bookings status breakdown
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
    ]);

    // 2. Branch-specific analytics
    const branches = await Branch.find();
    const branchBreakdown = [];
    const today = new Date();

    for (const branch of branches) {
      const branchRoomsCount = await Room.countDocuments({ branchId: branch._id });

      // Booked rooms today
      const activeBookingsToday = await Booking.distinct('roomId', {
        branchId: branch._id,
        bookingStatus: { $ne: 'cancelled' },
        checkInDate: { $lte: today },
        checkOutDate: { $gte: today },
      });
      const bookedCount = activeBookingsToday.length;
      const occupancyRate = branchRoomsCount > 0 ? (bookedCount / branchRoomsCount) * 100 : 0;

      // Revenue generated
      const branchRevenueResult = await Booking.aggregate([
        { $match: { branchId: branch._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      const branchRevenue = branchRevenueResult[0]?.total || 0;

      branchBreakdown.push({
        branchId: branch._id,
        branchName: branch.branchName,
        city: branch.city,
        totalRooms: branchRoomsCount,
        bookedRoomsToday: bookedCount,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        revenue: branchRevenue,
      });
    }

    res.json({
      success: true,
      reports: {
        summary: {
          totalRevenue,
          totalRooms,
          totalBranches,
          totalBookings,
          bookingsByStatus,
        },
        branchBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
