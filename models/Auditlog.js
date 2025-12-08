
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    actionType: {
      type: String,
      enum: [
        "WALLET_CREDIT",
        "WALLET_DEBIT",
        "WALLET_REFUND",
        "BOOKING_PAYMENT",
        "BOOKING_REFUND",
        "COUPON_APPLIED",
        "REFERRAL_REWARD",
        "ADMIN_CONFIG_CHANGE",
      ],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    referenceModel: {
      type: String,
      enum: ["WalletTransaction", "BookingTransaction", "CouponUsage", "Referral", "SystemConfig"],
      required: false,
    },
    referenceId: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      default: "",
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
