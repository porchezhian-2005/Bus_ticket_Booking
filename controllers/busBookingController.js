import Booking from '../models/Booking.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { generateUniquePNR } from '../utils/pnrGenerator.js';


import { createBookingSchema } from '../validator/busBookingValidator.js';

export const createBooking = async (req, res) => {
   
    const { error } = createBookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            details: error.details[0].message
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { busId, travelDate, seats, passengers, totalAmount } = req.body;
        const userId = req.user._id;

        const bookingDate = new Date(travelDate);

        const seatNumbers = seats.map(s => s.seatNumber);

        const seatInventory = await Seat.find({
            busId: busId,
            travelDate: bookingDate,
            seatNumber: { $in: seatNumbers },
        }).session(session);

        if (seatInventory.length !== seatNumbers.length) {
            await session.abortTransaction();
            return res.status(404).json({ message: "One or more requested seats were not found." });
        }

        const bookedConflict = seatInventory.find(
            seat => seat.isBooked || seat.isTemporarilyBlocked
        );

        if (bookedConflict) {
            await session.abortTransaction();
            return res.status(409).json({
                message: `Seat ${bookedConflict.seatNumber} is already ${bookedConflict.isBooked ? 'booked' : 'blocked'}.`
            });
        }

        await Seat.updateMany(
            { _id: { $in: seatInventory.map(s => s._id) } },
            { $set: { isTemporarilyBlocked: true } },
            { session: session }
        );

        const pnrNumber = generateUniquePNR();

        const newBooking = await Booking.create(
            [{
                userId,
                busId,
                travelDate: bookingDate,
                totalAmount,
                pnrNumber,
                seats: seats,
                passengers: passengers,
                status: 'Reserved'
            }],
            { session: session }
        );

        await session.commitTransaction();

        res.status(201).json({
            message: "Seats reserved successfully. Proceed to payment.",
            bookingId: newBooking[0]._id,
            pnr: pnrNumber,
            totalAmount: totalAmount,
        });

    } catch (err) {
        await session.abortTransaction();
        console.error("Error during booking creation and transaction:", err);

        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(500).json({
                message: "A unique key conflict occurred (duplicate PNR).",
                details: err.message
            });
        }

        res.status(500).json({ message: `Server error: ${err.message}` });
    } finally {
        session.endSession();
    }
};

export const viewBookingHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ userId })
            .sort({ createdAt: -1 })
            .select('-passengers -__v');

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ message: "You have no booking history." });
        }

        res.status(200).json({
            count: bookings.length,
            bookings: bookings
        });

    } catch (err) {
        console.error("Error fetching booking history:", err);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

export const cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        const booking = await Booking.findOne({ _id: bookingId, userId }).session(session);

        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Booking not found or does not belong to user." });
        }

        if (booking.status === 'Cancelled') {
            await session.abortTransaction();
            return res.status(400).json({ message: "Booking is already cancelled." });
        }

        const seatNumbers = booking.seats.map(s => s.seatNumber);

        booking.status = 'Cancelled';
        await booking.save({ session });

        await Seat.updateMany(
            {
                busId: booking.busId,
                travelDate: booking.travelDate,
                seatNumber: { $in: seatNumbers }
            },
            { $set: { isBooked: false, isTemporarilyBlocked: false } },
            { session: session }
        );

        await session.commitTransaction();

        res.status(200).json({
            message: "Booking successfully cancelled. Seats released.",
            pnr: booking.pnrNumber,
            refundStatus: "Pending (Simulated Refund)"
        });

    } catch (err) {
        await session.abortTransaction();
        console.error("Error during booking cancellation:", err);
        res.status(500).json({ message: `Server error during cancellation: ${err.message}` });
    } finally {
        session.endSession();
    }
};
