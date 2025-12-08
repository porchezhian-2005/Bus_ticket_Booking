import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true,
            trim: true,
        },

        email: { 
            type: String, 
            required: true, 
            unique: true 
        },

        country_code: { 
            type: String, 
            required: false, 
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

        isAdmin: { 
            type: Boolean, 
            default: false
        },

        isVerified: {
            type: Boolean, 
            default: false 
        },

        otp: { type: String },
        otpExpires: { type: Date },

        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },

        // ⭐ REFERRAL SYSTEM FIELDS ⭐
        referralCode: {
            type: String,
            unique: true,
            default: function () {
                const random = Math.random().toString(36).substring(2, 8).toUpperCase();
                return `REF-${random}`;
            }
        },

        referredBy: {
            type: String, // stores referralCode of the referrer
            default: null
        },

        referralEarnings: {
            type: Number,
            default: 0
        },

        referralUsers: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                status: { type: String, enum: ["pending", "successful"], default: "pending" }
            }
        ]
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
