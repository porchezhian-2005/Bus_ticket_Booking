import Bus from "../models/Bus.js"; 

export const searchBus = async (req, res) => {
  try {
    const { source, destination, date } = req.body;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date required" });
    }

    const buses = await Bus.find({
      source: source.toLowerCase(),
      destination: destination.toLowerCase(),
      date: date
    });

    if (!buses.length) {
      return res.status(404).json({ message: "No buses found" });
    }

    res.status(200).json({ buses });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
