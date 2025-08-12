import mongoose from 'mongoose';

const RidePostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originCity: { type: String, required: true },
  travelDate: { type: Date, required: true },
  arrivalTime: { type: String },
  transportMode: { type: String, enum: ['Train', 'Flight', 'Bus', 'Auto', 'Cab'], required: true },
  additionalNotes: { type: String },
  phone: { type: String },
  phoneVisible: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

export default mongoose.model('RidePost', RidePostSchema);
