import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seatNumber: { type: String, required: true, maxlength: 5 },
  seatType: { type: String, enum: ['Sleeper - Upper', 'Sleeper - Lower', 'Seater', 'Window'], required: true },
  basePrice: { type: Number, required: true, min: 0 },
  isBooked: { type: Boolean, default: false },
  isTemporarilyBlocked: { type: Boolean, default: false },
  travelDate: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'Reserved', 'Booked'], default: 'Available' },
}, { timestamps: true });

export default mongoose.model('Seat', seatSchema);
