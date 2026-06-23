import Branch from '../models/Branch.js';
import Room from '../models/Room.js';

// @desc    Get all branches (optionally filter by city)
// @route   GET /api/customer/branches
// @access  Public
export const getBranches = async (req, res, next) => {
  try {
    const { city } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const branches = await Branch.find(query).populate('managerId', 'name email phone');

    res.json({
      success: true,
      count: branches.length,
      branches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single branch details
// @route   GET /api/customer/branches/:id
// @access  Public
export const getBranchById = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id).populate('managerId', 'name email phone');
    if (!branch) {
      res.statusCode = 404;
      throw new Error('Branch not found');
    }

    res.json({
      success: true,
      branch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rooms by branch ID
// @route   GET /api/customer/rooms/:branchId
// @access  Public
export const getRoomsByBranch = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    // Optional query param to filter only available rooms
    const onlyAvailable = req.query.available === 'true';
    let query = { branchId };

    if (onlyAvailable) {
      query.isAvailable = true;
    }

    const rooms = await Room.find(query);

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};
