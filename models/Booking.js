import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male','Female','Other'], required: true }
}, { _id: false });

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  seatType: { type: String },
  basePrice: { type: Number, required: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  travelDate: { type: Date, required: true },
  pnrNumber: { type: String, unique: true, required: true },
  seats: { type: [seatSchema], required: true },
  passengers: { type: [passengerSchema], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Reserved','Confirmed','Cancelled','Failed'], default: 'Reserved' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  cancellationReason: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
