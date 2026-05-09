const studentRoutes = require('./routes/studentRoutes');

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware - allows Express to read JSON from requests
app.use(express.json());

app.use('/api/students', studentRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });