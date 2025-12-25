import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected sucessfully");
        
    }
    catch(err){
        console.log(`Error message : ${err}`);
        process.exit(1);
    }
}


