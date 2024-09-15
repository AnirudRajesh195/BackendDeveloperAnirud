require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');

// Import your routes
const authRoutes = require('./routes/authRoutes');  // Add this line
const userRoutes = require('./routes/userRoutes');  // Assuming user routes exist
const activityLogRoutes = require('./routes/activityLogRoutes'); // Import activity log routes

// Middlewares
const authMiddleware = require('./middlewares/authMiddleware'); // For protected routes

// Express app setup
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Set up the server and Socket.IO
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Mount routes
app.use('/api/auth', authRoutes);  // Mount auth routes
app.use('/api/users', authMiddleware, userRoutes); // Protect user routes with the auth middleware
app.use('/api', activityLogRoutes); // Register activity log routes

// JWT authentication for Socket.IO (if required)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('No token provided'));
  }
});

// Listen for connections on Socket.IO
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.email}`);

  // Handle login success, last login, etc.

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Set the port and start the server
const PORT = process.env.PORT || 5007;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
