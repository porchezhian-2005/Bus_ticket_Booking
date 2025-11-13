import Bus from "../models/Bus.js";


export const searchBus = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date are required" });
    }

    const buses = await Bus.find({
      source: { $regex: new RegExp(source, "i") },
      destination: { $regex: new RegExp(destination, "i") },
      date,
    });

    if (buses.length === 0) {
      return res.status(404).json({ message: "No buses found" });
    }

    res.status(200).json({ message: "Buses found", buses });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
