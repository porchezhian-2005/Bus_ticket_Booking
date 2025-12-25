import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },

  discountType: { type: String, enum: ["flat", "percentage"], required: true },
  discountValue: { type: Number, required: true },

  maxDiscountAmount: { type: Number, default: 0 },

  minBookingAmount: { type: Number, default: 0 },

  maxUsagePerUser: { type: Number, default: 1 },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isActive: { type: Boolean, default: true },

}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
