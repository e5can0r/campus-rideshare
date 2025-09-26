import RidePost from '../models/RidePost.js';


import User from '../models/User.js';
import { sendJoinNotification } from '../utils/sendMail.js';

export const postRide = async (req, res) => {
  try {
    const ride = new RidePost({ ...req.body, userId: req.user.id ,participants: [req.user.id],});
    await ride.save();
    // Populate the userId field before sending response
    await ride.populate('userId', 'name email');
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Ride post failed' });
  }
};

export const getRides = async (req, res) => {
  const { originCity, travelDate, transportMode } = req.query;
  const filters = {};
  
  // Case-insensitive city search using regex
  if (originCity) {
    filters.originCity = { $regex: new RegExp(originCity, 'i') };
  }
  
  if (transportMode) filters.transportMode = transportMode;
  
  // Handle date filtering
  if (travelDate) {
    // If specific date is provided, use that date
    const specificDate = new Date(travelDate);
    specificDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(specificDate);
    nextDay.setDate(nextDay.getDate() + 1);
    filters.travelDate = { $gte: specificDate, $lt: nextDay };
  } else {
    // Always filter out past rides when no specific date is provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filters.travelDate = { $gte: today };
  }

  try {
    const rides = await RidePost.find(filters).populate('userId', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rides' });
  }
};

export const joinRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user.id; // from authMiddleware

    // Use RidePost instead of Ride
    const ride = await RidePost.findById(rideId).populate('userId');
    const user = await User.findById(userId);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Ensure participants array exists
    if (!ride.participants) ride.participants = [];

    if (ride.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this ride' });
    }

    ride.participants.push(userId);
    await ride.save();

    // Send email to the ride creator
    if (ride.userId && ride.userId.email) {
      await sendJoinNotification(ride.userId.email, user.name, ride);
    }

    res.status(200).json(ride); // <-- return the updated ride
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCreatedRides = async (req, res) => {
  try {
    const rides = await RidePost.find({ userId: req.user.id }).populate('userId', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch created rides' });
  }
};

export const getJoinedRides = async (req, res) => {
  try {
    const rides = await RidePost.find({ participants: req.user.id }).populate('userId', 'name email');
    res.json(rides);
  } catch (err) {
    console.error('Error getting joined rides:', err);
    res.status(500).json({ error: 'Failed to fetch joined rides' });
  }
};

export const updateRide = async (req, res) => {
  const { rideId } = req.params;
  try {
    const ride = await RidePost.findById(rideId);
    if (ride.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    Object.assign(ride, req.body);
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deleteRide = async (req, res) => {
  const { rideId } = req.params;
  try {
    const ride = await RidePost.findById(rideId);
    if (ride.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await ride.deleteOne();
    res.json({ message: 'Ride deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

export const getRideById = async (req, res) => {
  try {
    const ride = await RidePost.findById(req.params.rideId)
      .populate('participants', 'name phone') // <-- populate name and phone
      .populate('userId', 'name email');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};