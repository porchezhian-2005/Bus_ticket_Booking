import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/walletTransaction.js";
import WalletConfig from "../models/walletConfig.js";
import Booking from "../models/Booking.js";
import { parsePagination } from "../utils/pagination.js";

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0 });
  }
  return wallet;
};

const getWalletConfig = async () => {
  let config = await WalletConfig.findOne();
  if (!config) {
    config = await WalletConfig.create({ maxWalletUsagePercent: 20 });
  }
  return config;
};

export const getMyWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    return res.status(200).json({
      success: true,
      balance: wallet.balance,
      currency: wallet.currency
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyWalletTransactions = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    const { page, limit, skip } = parsePagination(req.query);

    const total = await WalletTransaction.countDocuments({ walletId: wallet._id });
    const transactions = await WalletTransaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      transactions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount, paymentReference } = req.body;
    const wallet = await getOrCreateWallet(req.user._id);

    wallet.balance += amount;
    await wallet.save();

    const transaction = await WalletTransaction.create({
      walletId: wallet._id,
      userId: req.user._id,
      type: "credit",
      amount,
      balanceAfter: wallet.balance,
      referenceType: "payment",
      referenceId: paymentReference || "",
      description: "Wallet top-up"
    });

    return res.status(200).json({
      success: true,
      message: "Wallet credited successfully",
      balance: wallet.balance,
      transaction
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const payWithWallet = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Booking already paid" });
    }

    if (booking.couponCode || booking.couponDiscount) {
      return res.status(400).json({ success: false, message: "Wallet and coupons cannot be used together" });
    }

    const wallet = await getOrCreateWallet(req.user._id);
    const config = await getWalletConfig();

    const totalAmount = booking.totalAmount;
    const maxAllowedFromWallet = (totalAmount * config.maxWalletUsagePercent) / 100;

    const alreadyUsed = booking.walletUsedAmount || 0;
    const remainingAmountToCover = totalAmount - alreadyUsed;

    if (remainingAmountToCover <= 0) {
      return res.status(400).json({ success: false, message: "No remaining amount to pay from wallet" });
    }

    const maxUsableNow = Math.min(maxAllowedFromWallet - alreadyUsed, remainingAmountToCover);
    const amountToDeduct = Math.min(wallet.balance, maxUsableNow);

    if (amountToDeduct <= 0) {
      return res.status(400).json({ success: false, message: "Cannot use wallet for this booking" });
    }

    wallet.balance -= amountToDeduct;
    await wallet.save();

    const newWalletUsed = alreadyUsed + amountToDeduct;
    booking.walletUsedAmount = newWalletUsed;
    if (newWalletUsed >= totalAmount) {
      booking.paymentStatus = "paid";
    } else {
      booking.paymentStatus = "partial";
    }
    await booking.save();

    const transaction = await WalletTransaction.create({
      walletId: wallet._id,
      userId: req.user._id,
      type: "debit",
      amount: amountToDeduct,
      balanceAfter: wallet.balance,
      referenceType: "booking",
      referenceId: bookingId,
      description: "Wallet payment for booking"
    });

    return res.status(200).json({
      success: true,
      message: "Wallet payment processed",
      amountDeducted: amountToDeduct,
      walletBalance: wallet.balance,
      booking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateWalletConfig = async (req, res) => {
  try {
    const { maxWalletUsagePercent } = req.body;
    let config = await WalletConfig.findOne();
    if (!config) {
      config = await WalletConfig.create({ maxWalletUsagePercent });
    } else {
      config.maxWalletUsagePercent = maxWalletUsagePercent;
      await config.save();
    }

    return res.status(200).json({
      success: true,
      message: "Wallet config updated",
      config
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const processWalletRefundForBooking = async (bookingId, refundAmount, userId) => {
  const wallet = await getOrCreateWallet(userId);
  wallet.balance += refundAmount;
  await wallet.save();

  await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: "refund",
    amount: refundAmount,
    balanceAfter: wallet.balance,
    referenceType: "booking",
    referenceId: bookingId,
    description: "Wallet refund for booking cancellation"
  });

  return wallet.balance;
};
