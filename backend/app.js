import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import branchManagerRoutes from './routes/branchManagerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Initialize dotenv configuration
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Adjust origins as necessary for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Aura Hotel Booking System REST API'
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', branchManagerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
