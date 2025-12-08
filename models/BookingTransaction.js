
import mongoose from "mongoose";

const bookingTransactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    walletAmount: {
      type: Number,
      default: 0,
    },
    gatewayAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "gateway", "mixed", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partial"],
      required: true,
    },
    gatewayReference: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const BookingTransaction = mongoose.model(
  "BookingTransaction",
  bookingTransactionSchema
);
export default BookingTransaction;
