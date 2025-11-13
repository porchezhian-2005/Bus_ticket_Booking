import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    country_code: { 
        type: String, 
        required: true 
    },
    phone_no: {
         type: String, 
         required: true, 
         unique: true 
        },
    password: { 
        type: String, 
        required: true 
    },

  
    isVerified: {
         type: Boolean, 
         default: false 
        },
    otp: { 
        type: String
     },               
    otpExpires: {
         type: Date 
        },


    resetPasswordToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date
     },
  },
  { timestamps: true }
);

const User =  mongoose.model("User", userSchema);
export default User ;