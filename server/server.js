import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rideRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import Message from './models/Message.js';

dotenv.config();

const app = express();

// Allowed origins: frontend deployed and localhost for dev
const allowedOrigins = [
  'https://campus-rideshare-frontend.vercel.app', // deployed frontend
  'http://localhost:3000' // local dev frontend
];

// Enable CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allows Authorization headers / cookies
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO setup
const server = http.createServer(app);
const io = new SocketIo(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join_room', (rideId) => {
    socket.join(rideId);
    console.log(`User ${socket.id} joined room ${rideId}`);
  });

  socket.on('send_message', async (data) => {
    const { rideId, message, sender } = data;

    const newMessage = new Message({
      rideId,
      message,
      sender,
      timestamp: new Date(),
    });

    try {
      await newMessage.save();
      io.to(rideId).emit('receive_message', {
        sender,
        message,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
