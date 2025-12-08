import Booking from '../models/Booking.js';

export const generateUniquePNR = async () => {
    const PNR_LENGTH = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    let isUnique = false;

    while (!isUnique) {
        pnr = '';
        for (let i = 0; i < PNR_LENGTH; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pnr += characters.charAt(randomIndex);
        }

        const existingBooking = await Booking.findOne({ pnrNumber: pnr });

        if (!existingBooking) {
            isUnique = true;
        }
    }
    
    return pnr;
};