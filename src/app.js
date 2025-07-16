const express = require('express');
const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connected successfully');

    // Start server only after DB connection
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

