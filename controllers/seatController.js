import Seat from '../models/Seat.js';
import Bus from '../models/Bus.js';


export const createSeatInventory = async (req, res) => {
  try {
    const { seats } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "No seat data provided." });
    }

    const busId = seats[0].busId;
    const busExists = await Bus.findById(busId);
    if (!busExists) return res.status(404).json({ message: "Bus not found." });

    const seatRecords = seats.map(seat => ({
      ...seat,
      status: seat.status || 'Available',
    }));

    const result = await Seat.insertMany(seatRecords);

    res.status(201).json({
      message: `${result.length} seat records created successfully for bus ${busId}.`,
      seats: result
    });
  } catch (err) {
    console.error("Error creating seat inventory:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const getSeatAvailability = async (req, res) => {
  try {
    const { busId } = req.params;
    const seats = await Seat.find({ busId }).select('-__v -createdAt -updatedAt -busId');

    if (!seats || seats.length === 0) {
      return res.status(404).json({ message: "No seat inventory found for this bus." });
    }

    const seatMap = seats.map(seat => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      basePrice: seat.basePrice,
      status: seat.isBooked ? 'Booked' : (seat.isTemporarilyBlocked ? 'Blocked' : 'Available'),
    }));

    res.status(200).json({ count: seats.length, seatMap });
  } catch (err) {
    console.error("Error fetching seat availability:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
