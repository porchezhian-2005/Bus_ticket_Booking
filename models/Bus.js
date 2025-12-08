import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
 routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
    busType: { 
        type: String, 
        required: true, 
        enum: ['AC Seater', 'AC Sleeper', 'Non-AC Seater', 'Non-AC Sleeper'] 
    },
    operatorName: { 
        type: String, 
        required: true 
    },
    departureTime: { 
        type: String, 
        required: true 
    },
   
    arrivalTime: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    baseFare: { 
        type: Number, 
        required: true 
    },
    totalSeats: { 
        type: Number, 
        required: true 
    },
    seatsAvailable: { 
        type: Number, 
        required: true 
    },
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);
export default Bus;
