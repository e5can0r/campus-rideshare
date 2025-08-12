import express from 'express';
import {
  postRide,
  getRides,
  joinRide,
  getCreatedRides,
  getJoinedRides,
  updateRide,
  deleteRide,
  getRideById, // <-- Add this import
} from '../controllers/rideController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, postRide);
router.post('/:rideId/join', authMiddleware, joinRide);
router.get('/', getRides);

// ✅ New routes:
router.get('/created', authMiddleware, getCreatedRides);
router.get('/joined', authMiddleware, getJoinedRides);

router.put('/:rideId', authMiddleware, updateRide);      // <-- new
router.delete('/:rideId', authMiddleware, deleteRide);   // <-- new
router.get('/:rideId', authMiddleware, getRideById); // 

export default router;
