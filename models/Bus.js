import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  bus_name: 
  { 
    type: String, 
    required: true },
  source: 
  { type: String, 
    required: true },
  destination: 
  { type: String, 
    required: true },
  departure_time: 
  { type: String,
    required: true },
  arrival_time: 
  { type: String, 
    required: true },
  total_seats: 
  { type: Number, 
    required: true },
  available_seats: 
  { type: Number, 
    required: true },
  fare: 
  { type: Number, 
    required: true }
});

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
