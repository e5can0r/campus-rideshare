import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import rideRoutes from './routes/rideRoutes.js';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import Message from './models/Message.js';
import messageRoutes from './routes/messageRoutes.js';
dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5000', 'https://your-frontend.vercel.app'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/messages', messageRoutes);

//socket code 
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

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


mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on ${process.env.PORT}`);
  }))
  .catch((err) => console.error(err));
