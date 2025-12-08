import Booking from "../models/Booking.js";
import { generateTicketPDF } from "../utils/pdfGenerator.js";
import mongoose from "mongoose";


export const getTicketById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate("busId", "busName busNumber source destination");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const cancelTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status === "Cancelled") return res.status(400).json({ success: false, message: "Ticket already cancelled" });

    const now = new Date();
    let refundAmount = 0;
    const hoursDiff = (booking.travelDate - now) / 36e5;

    if (hoursDiff > 24) refundAmount = booking.totalAmount * 0.8;
    else refundAmount = booking.totalAmount * 0.5;

    booking.status = "Cancelled";
    booking.cancellationReason = req.body.reason || "User cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Ticket cancelled", refundAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const downloadTicketPDF = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate("busId", "busName busNumber source destination");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const pdfBuffer = await generateTicketPDF({
      passengerName: booking.passengers.map(p => p.name).join(", "),
      email: booking.userId.email,
      busName: booking.busId.busName,
      busNumber: booking.busId.busNumber,
      seats: booking.seats.map(s => s.seatNumber),
      date: booking.travelDate.toDateString(),
      from: booking.busId.source,
      to: booking.busId.destination,
      bookingId: booking._id,
      cancellationStatus: booking.status === "Cancelled" ? "Cancelled" : null,
      refundAmount: booking.status === "Cancelled" ? booking.totalAmount * 0.8 : null
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket_${booking._id}.pdf`
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
