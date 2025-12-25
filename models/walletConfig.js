import mongoose from "mongoose";

const walletConfigSchema = new mongoose.Schema(
  {
    maxWalletUsagePercent: {
      type: Number,
      default: 20
    }
  },
  { timestamps: true }
);

const WalletConfig = mongoose.model("WalletConfig", walletConfigSchema);
export default WalletConfig;
