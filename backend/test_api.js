import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import Branch from './models/Branch.js';
import Room from './models/Room.js';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';

dotenv.config();

const PORT = 5999;
const BASE_URL = `http://localhost:${PORT}/api`;

const apiRequest = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

async function executeTestCases() {
  console.log('\n--- Starting Integration Test Cases ---\n');

  let customerToken = '';
  let adminToken = '';
  let managerToken = '';

  let branchId = '';
  let deluxeRoomId = '';
  let suiteRoomId = '';
  let bookingId = '';

  // 1. Register customer user
  console.log('Test Case 1: Register Customer...');
  const regRes = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirmPassword: 'password123',
    }),
  });
  if (!regRes.success || !regRes.token) {
    throw new Error('Customer registration failed');
  }
  customerToken = regRes.token;
  console.log('✔ Customer registered successfully.\n');

  // 2. Login Central Admin
  console.log('Test Case 2: Login Central Admin...');
  const loginAdminRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@aurahotels.com',
      password: 'adminpassword',
    }),
  });
  if (!loginAdminRes.success || !loginAdminRes.token) {
    throw new Error('Admin login failed');
  }
  adminToken = loginAdminRes.token;
  console.log('✔ Admin logged in successfully.\n');

  // 3. Admin: Create Branch (with Manager credentials)
  console.log('Test Case 3: Create Branch (Admin)...');
  const branchRes = await apiRequest('/admin/branch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      branchName: 'Aura Palace Mumbai',
      city: 'Mumbai',
      address: '123 Marine Drive, Mumbai',
      description: 'Stunning sea-facing boutique hotel',
      amenities: ['Spa', 'Infinity Pool', 'Gym'],
      images: ['mumbai_exterior.jpg'],
      managerName: 'Mumbai Manager',
      managerEmail: 'mumbai@aurahotels.com',
      managerPhone: '9876543210',
      managerPassword: 'managerpassword',
    }),
  });
  if (!branchRes.success || !branchRes.branch || !branchRes.manager) {
    throw new Error('Branch creation failed');
  }
  branchId = branchRes.branch._id;
  console.log(`✔ Branch '${branchRes.branch.branchName}' created.`);
  console.log(`✔ Branch Manager '${branchRes.manager.email}' credentials generated.\n`);

  // 4. Admin: Create a Deluxe Room
  console.log('Test Case 4: Create Deluxe Room (Admin)...');
  const roomRes = await apiRequest('/admin/room', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      branchId,
      roomNumber: '101',
      roomType: 'Deluxe',
      price: 150,
      capacity: 2,
      amenities: ['Sea View', 'Mini Bar', 'King Bed'],
      images: ['room_101.jpg'],
    }),
  });
  if (!roomRes.success || !roomRes.room) {
    throw new Error('Room creation failed');
  }
  deluxeRoomId = roomRes.room._id;
  console.log(`✔ Deluxe Room '${roomRes.room.roomNumber}' created.\n`);

  // 5. Manager: Login & Dashboard Check
  console.log('Test Case 5: Login Branch Manager...');
  const loginManagerRes = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'mumbai@aurahotels.com',
      password: 'managerpassword',
    }),
  });
  if (!loginManagerRes.success || !loginManagerRes.token) {
    throw new Error('Manager login failed');
  }
  managerToken = loginManagerRes.token;
  console.log('✔ Branch Manager logged in successfully.');

  console.log('Checking Manager Dashboard...');
  const managerDash = await apiRequest('/manager/dashboard', {
    headers: { Authorization: `Bearer ${managerToken}` },
  });
  if (!managerDash.success || managerDash.dashboard.stats.totalRooms !== 1) {
    throw new Error('Manager dashboard check failed');
  }
  console.log(`✔ Manager dashboard loaded. Managed branch: ${managerDash.dashboard.branchName}\n`);

  // 6. Manager: Create Suite Room
  console.log('Test Case 6: Create Suite Room (Manager)...');
  const managerRoomRes = await apiRequest('/manager/room', {
    method: 'POST',
    headers: { Authorization: `Bearer ${managerToken}` },
    body: JSON.stringify({
      roomNumber: '102',
      roomType: 'Suite',
      price: 300,
      capacity: 4,
      amenities: ['Jacuzzi', 'Separate Living Area', 'Butler Service'],
      images: ['room_102.jpg'],
    }),
  });
  if (!managerRoomRes.success || !managerRoomRes.room) {
    throw new Error('Manager room creation failed');
  }
  suiteRoomId = managerRoomRes.room._id;
  console.log(`✔ Suite Room '${managerRoomRes.room.roomNumber}' created by manager.\n`);

  // 7. Customer: Browse Branches & Rooms
  console.log('Test Case 7: Search and Browse (Customer)...');
  const branchesSearch = await apiRequest('/customer/branches?city=mumbai');
  if (!branchesSearch.success || branchesSearch.count === 0) {
    throw new Error('Customer branch search failed');
  }
  console.log('✔ Search branches by city success.');

  const roomsList = await apiRequest(`/customer/rooms/${branchId}?available=true`);
  if (!roomsList.success || roomsList.count !== 2) {
    throw new Error('Customer rooms list fetch failed');
  }
  console.log('✔ Fetch branch rooms success.\n');

  // 8. Customer: Book Room & Verify Price
  console.log('Test Case 8: Book Deluxe Room & Verify Price (Customer)...');
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 2); // 2 days from now
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 5); // 5 days from now (3 nights)

  const bookingRes = await apiRequest('/customer/book-room', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      roomId: deluxeRoomId,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      guests: 2,
    }),
  });
  if (!bookingRes.success || !bookingRes.booking) {
    throw new Error('Booking creation failed');
  }
  bookingId = bookingRes.booking._id;
  
  // Verify pricing: 3 nights * $150 = $450
  if (bookingRes.booking.totalAmount !== 450) {
    throw new Error(`Pricing incorrect: Expected 450, got ${bookingRes.booking.totalAmount}`);
  }
  console.log(`✔ Booking created for ${bookingRes.booking.totalAmount} currency units.`);
  console.log(`✔ Nights checked: 3 nights successfully calculated.\n`);

  // 9. Double Booking Protection Check
  console.log('Test Case 9: Verify Double-Booking Protection...');
  try {
    await apiRequest('/customer/book-room', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        roomId: deluxeRoomId,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        guests: 1,
      }),
    });
    throw new Error('Double booking did not trigger overlap rejection');
  } catch (error) {
    if (error.message.includes('already booked')) {
      console.log('✔ Double-booking prevention working: Overlapping dates rejected.');
    } else {
      throw error;
    }
  }

  // Test overlapping date checks (e.g. 1 day overlap)
  const overlapCheckIn = new Date(checkInDate);
  overlapCheckIn.setDate(overlapCheckIn.getDate() + 1);
  const overlapCheckOut = new Date(checkOutDate);
  overlapCheckOut.setDate(overlapCheckOut.getDate() + 1);

  try {
    await apiRequest('/customer/book-room', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({
        roomId: deluxeRoomId,
        checkInDate: overlapCheckIn.toISOString(),
        checkOutDate: overlapCheckOut.toISOString(),
        guests: 1,
      }),
    });
    throw new Error('Double booking did not trigger overlap rejection for partial overlaps');
  } catch (error) {
    if (error.message.includes('already booked')) {
      console.log('✔ Double-booking prevention working: Partial overlapping dates rejected.\n');
    } else {
      throw error;
    }
  }

  // 10. Process Payment & Confirm Booking
  console.log('Test Case 10: Process Payment & Confirm...');
  const payRes = await apiRequest('/payment/process', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: JSON.stringify({
      bookingId,
      paymentMethod: 'Credit Card',
      transactionId: `TXN-${Date.now()}`,
    }),
  });
  if (!payRes.success || payRes.booking.paymentStatus !== 'paid' || payRes.booking.bookingStatus !== 'confirmed') {
    throw new Error('Payment processing failed');
  }
  console.log('✔ Payment completed, booking status updated to confirmed.\n');

  // 11. Customer: View History
  console.log('Test Case 11: Get Booking History...');
  const history = await apiRequest('/customer/bookings', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  if (!history.success || history.count !== 1) {
    throw new Error('Booking history check failed');
  }
  console.log('✔ Booking list loaded into history.\n');

  // 12. Manager: Verify occupancy list
  console.log('Test Case 12: Manager Occupancy Tracking...');
  // Modify booking dates temporarily to overlap "today" to verify occupancy reports
  const activeBooking = await Booking.findById(bookingId);
  const backInDate = new Date();
  backInDate.setDate(backInDate.getDate() - 1);
  const backOutDate = new Date();
  backOutDate.setDate(backOutDate.getDate() + 2);
  activeBooking.checkInDate = backInDate;
  activeBooking.checkOutDate = backOutDate;
  await activeBooking.save();

  const occupancy = await apiRequest('/manager/occupancy', {
    headers: { Authorization: `Bearer ${managerToken}` },
  });
  if (!occupancy.success || occupancy.occupancy.occupiedRoomsCount !== 1) {
    throw new Error('Manager occupancy tracking failed');
  }
  console.log(`✔ Manager Occupancy report: ${occupancy.occupancy.occupancyPercentage}% occupied.`);
  console.log(`✔ Active Guest Details parsed: ${occupancy.occupancy.activeBookings[0].guestName}.\n`);

  // 13. Admin: Verify reports
  console.log('Test Case 13: Admin Reports & Ledger check...');
  const reports = await apiRequest('/admin/reports', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!reports.success || reports.reports.summary.totalRevenue === 0) {
    throw new Error('Admin report check failed');
  }
  console.log(`✔ Admin Reports loaded: Total revenue: $${reports.reports.summary.totalRevenue}.`);
  console.log(`✔ Branch-wise details parsed. Mumbai occupancy: ${reports.reports.branchBreakdown[0].occupancyRate}%.\n`);
}

async function runTests() {
  try {
    await connectDB();

    console.log('Cleaning up previous test data...');
    // Delete test customer and manager
    await User.deleteMany({
      email: { $in: ['johndoe@example.com', 'mumbai@aurahotels.com', 'admin@aurahotels.com'] },
    });
    // Create admin user for testing
    const adminUser = new User({
      name: 'Central Admin',
      email: 'admin@aurahotels.com',
      phone: '0000000000',
      password: 'adminpassword',
      role: 'admin',
    });
    await adminUser.save();
    console.log('Seed: Test admin seeded.');

    // Start server
    const server = app.listen(PORT, async () => {
      console.log(`Test environment server listening on port ${PORT}`);
      try {
        await executeTestCases();
        console.log('====================================================');
        console.log('SUCCESS: All hotel booking API tests passed successfully!');
        console.log('====================================================');
        cleanupAndExit(server, 0);
      } catch (err) {
        console.error('====================================================');
        console.error('ERROR: Integration test suite failed.');
        console.error(err);
        console.error('====================================================');
        cleanupAndExit(server, 1);
      }
    });
  } catch (error) {
    console.error('Database connection failed for tests:', error.message);
    process.exit(1);
  }
}

async function cleanupAndExit(server, code) {
  try {
    console.log('Cleaning up seeded test users/branches...');
    const mumbaiBranch = await Branch.findOne({ branchName: 'Aura Palace Mumbai' });
    if (mumbaiBranch) {
      await Booking.deleteMany({ branchId: mumbaiBranch._id });
      await Room.deleteMany({ branchId: mumbaiBranch._id });
      await Branch.findByIdAndDelete(mumbaiBranch._id);
    }
    await User.deleteMany({
      email: { $in: ['johndoe@example.com', 'mumbai@aurahotels.com', 'admin@aurahotels.com'] },
    });
    console.log('Clean up finished.');
  } catch (e) {
    console.error('Error during test cleanup:', e.message);
  }
  server.close(async () => {
    console.log('Test server closed.');
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(code);
  });
}

runTests();
