import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema({
  maxWalletUse: {
    type: Number,
    default: 20, 
    min: 0,
    max: 100
  },
  referralReward: {
    type: Number,
    default: 500 
  }
}, { timestamps: true });

export default mongoose.model("SystemConfig", systemConfigSchema);
