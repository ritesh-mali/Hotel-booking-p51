import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start server after database connection is successful
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((error) => {
  console.error(`Failed to connect to database: ${error.message}`);
  process.exit(1);
});
