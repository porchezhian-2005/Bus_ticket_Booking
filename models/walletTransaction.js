import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["credit", "debit", "refund"],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    referenceType: {
      type: String,
      enum: ["booking", "payment", "admin", "refund", "other"],
      default: "other"
    },
    referenceId: {
      type: String
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);

const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);
export default WalletTransaction;
