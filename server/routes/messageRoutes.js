import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/messages/:rideId
router.get('/:rideId', async (req, res) => {
  try {
    const messages = await Message.find({ rideId: req.params.rideId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
