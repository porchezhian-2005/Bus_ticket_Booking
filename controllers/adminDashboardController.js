import User from "../models/User.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import { parsePagination } from "../utils/pagination.js";

export const createBus = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user?._id };
    const exists = await Bus.findOne({ busNumber: payload.busNumber });
    if (exists) return res.status(400).json({ success: false, message: "Bus already exists" });
    const bus = await Bus.create(payload);
    res.status(201).json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });
    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });
    res.json({ success: true, message: "Bus deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createRoute = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user?._id };
    const route = await Route.create(payload);
    res.status(201).json({ success: true, route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    res.json({ success: true, route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addStopToRoute = async (req, res) => {
  try {
    const { stop } = req.body;
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    route.stops.push(stop);
    await route.save();
    res.json({ success: true, route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    res.json({ success: true, message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) filter.userId = req.query.userId;
    if (req.query.busId && mongoose.Types.ObjectId.isValid(req.query.busId)) filter.busId = req.query.busId;
    if (req.query.status) filter.status = req.query.status;

    if (req.query.from || req.query.to) {
      filter.travelDate = {};
      if (req.query.from) filter.travelDate.$gte = new Date(req.query.from);
      if (req.query.to) filter.travelDate.$lte = new Date(req.query.to);
    }

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("busId", "busName busNumber")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ success: true, total, page, limit, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const last7 = new Date(startOfToday);
    last7.setDate(last7.getDate() - 6);

    const dailyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: last7 } } },
      { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const dailyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: last7 } } },
      { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } }
    ]);

    const totals = {
      users: await User.countDocuments(),
      buses: await Bus.countDocuments(),
      routes: await Route.countDocuments(),
      bookings: await Booking.countDocuments()
    };

    res.json({ success: true, dailyBookings, dailyRevenue, totals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
