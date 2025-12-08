
import WalletTransaction from "../models/walletTransaction.js";
import BookingTransaction from "../models/BookingTransaction.js";
import CouponUsage from "../models/couponUsage.js";
import Referral from "../models/Referral.js";
import AuditLog from "../models/Auditlog.js";
import { parsePagination } from "../utils/pagination.js";

export const getWalletTransactionsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const total = await WalletTransaction.countDocuments(filter);
    const transactions = await WalletTransaction.find(filter)
      .populate("userId", "name email phone_no")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      transactions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingTransactionsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.bookingId) filter.bookingId = req.query.bookingId;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const total = await BookingTransaction.countDocuments(filter);
    const transactions = await BookingTransaction.find(filter)
      .populate("userId", "name email phone_no")
      .populate("bookingId", "pnrNumber travelDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      transactions,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCouponUsageAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.couponId) filter.couponId = req.query.couponId;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const total = await CouponUsage.countDocuments(filter);
    const usage = await CouponUsage.find(filter)
      .populate("userId", "name email")
      .populate("couponId", "code discountType discountValue")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      usage,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getReferralRewardsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.referrerId) filter.referrer = req.query.referrerId;
    if (req.query.refereeId) filter.referee = req.query.refereeId;
    if (req.query.status) filter.status = req.query.status;

    const total = await Referral.countDocuments(filter);
    const referrals = await Referral.find(filter)
      .populate("referrer", "name email")
      .populate("referee", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      referrals,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFinancialReportAdmin = async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    to.setHours(23, 59, 59, 999);

    const bookingAgg = await BookingTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalWalletPaid: { $sum: "$walletAmount" },
          totalGatewayPaid: { $sum: "$gatewayAmount" },
          totalCouponDiscount: { $sum: "$couponDiscount" },
        },
      },
    ]);

    const walletAgg = await WalletTransaction.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      reportPeriod: { from, to },
      bookingsSummary: bookingAgg[0] || {
        totalRevenue: 0,
        totalWalletPaid: 0,
        totalGatewayPaid: 0,
        totalCouponDiscount: 0,
      },
      walletSummary: walletAgg,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAuditLogsAdmin = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.actionType) filter.actionType = req.query.actionType;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      logs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
