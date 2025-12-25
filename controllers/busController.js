// controllers/BusController.js
import Bus from "../models/Bus.js";

export const createBus = async (req, res) => {
  try {
    const {
      busName,
      busNumber,
      source,
      destination,
      travelDate,
      totalSeats,
      price,
      busType,
    } = req.body;

    const exists = await Bus.findOne({ busNumber });
    if (exists) {
      return res.status(400).json({ message: "Bus already exists." });
    }

    const newBus = await Bus.create({
      busName,
      busNumber,
      source,
      destination,
      travelDate,
      totalSeats,
      price,
      busType,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
