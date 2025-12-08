import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import Seat from '../models/Seat.js';
import mongoose from 'mongoose';


dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createRazorpayOrder = async (req, res) => {
    try {
        const { bookingId, totalAmount } = req.body; 

        if (!bookingId || !totalAmount) {
            return res.status(400).json({ message: "Booking ID and Total Amount are required to initiate payment." });
        }

        const amountInPaise = Math.round(totalAmount * 100); 

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: bookingId, 
            payment_capture: 1, 
        };

        const order = await razorpayInstance.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ message: "Failed to create Razorpay order." });
        }

        res.status(200).json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.error("Razorpay Order Creation Error:", err);
        res.status(500).json({ message: `Payment Order Creation failed: ${err.message}` });
    }
};


export const verifyPaymentAndConfirmBooking = async (req, res) => {
   
    
    const { razorpay_order_id, razorpay_payment_id, bookingId } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
       
        const booking = await Booking.findById(bookingId).session(session);

        if (!booking || booking.status !== 'Reserved') {
            await session.abortTransaction();
            return res.status(400).send('Booking is not in a reserved state or not found.');
        }

      
        booking.status = 'Confirmed';
        booking.razorpayOrderId = razorpay_order_id; 
        booking.razorpayPaymentId = razorpay_payment_id;
        await booking.save({ session });

       
        const seatNumbers = booking.seats.map(s => s.seatNumber);
        
        await Seat.updateMany(
            { 
                busId: booking.busId, 
                travelDate: booking.travelDate, 
                seatNumber: { $in: seatNumbers } 
            },
            { $set: { isBooked: true, isTemporarilyBlocked: false } },
            { session: session }
        );

        
        await session.commitTransaction();
        session.endSession();

     

        res.status(200).json({
            message: 'Payment verified and Booking CONFIRMED.',
            pnr: booking.pnrNumber,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Payment Verification Error:', error);
        res.status(500).send('Payment verification failed.');
    }
};