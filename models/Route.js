import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true } 
});

const routeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },

    stopPoints: {
        type: [stopSchema],
        default: [],
    }
}, { timestamps: true });

const Route = mongoose.model('Route', routeSchema);
export default Route;