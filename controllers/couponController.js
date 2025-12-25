import Coupon from "../models/Coupon.js";
import CouponUsage from "../models/couponUsage.js";
import { generateCouponCode } from "../utils/generateCouponcode.js";



export const createCoupon = async (req, res) => {
  try {
    const data = req.body;

    data.code = generateCouponCode();

    const coupon = await Coupon.create(data);

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, bookingAmount } = req.body;
    const userId = req.user._id;

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon code." });

    if (!coupon.isActive) return res.status(400).json({ success: false, message: "Coupon not active." });

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate)
      return res.status(400).json({ success: false, message: "Coupon expired or not active." });

    if (bookingAmount < coupon.minBookingAmount)
      return res.status(400).json({ success: false, message: "Booking amount too low for coupon." });

    let usage = await CouponUsage.findOne({ userId, couponId: coupon._id });
    if (usage && usage.usageCount >= coupon.maxUsagePerUser)
      return res.status(400).json({ success: false, message: "You have used this coupon already." });

    let discount = 0;

    if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    } else {
      discount = (bookingAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    }

    if (discount > bookingAmount) discount = bookingAmount;

    if (!usage) {
      await CouponUsage.create({ userId, couponId: coupon._id, usageCount: 1 });
    } else {
      usage.usageCount += 1;
      await usage.save();
    }

    return res.status(200).json({
      success: true,
      discount,
      finalAmount: bookingAmount - discount,
      message: "Coupon applied successfully."
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
