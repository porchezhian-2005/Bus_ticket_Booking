import User from "../models/User.js";
import { deleteUserSchema } from "../validator/authValidator.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { sendEmail } from '../config/email.js';
import { generateOTP } from '../utils/generateToken.js';
import { sendSmsVerification, checkSmsVerification } from '../config/sms.js';
import jwt from 'jsonwebtoken'; 

export const registerUser = async (req, res) => {
    try {
        const { name, email, phone_no, password, isAdmin } = req.body; 
        
        const formattedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [{ email: formattedEmail }, { phone_no }],
        });
        if (existingUser) {
            if (!existingUser.isVerified) {
                return res.status(400).json({ message: "User exists but email is not verified. Please verify your email." });
            }
            return res.status(400).json({ message: "User already exists and is verified." });
        }

        
        const otpCode = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        console.log("Sending OTP email to:", formattedEmail); 
        console.log(" OTP CODE:", otpCode);     

        const newUser = await User.create({
            name,
            email: formattedEmail,
            phone_no,
            password: password, 
            isVerified: false,
            otp: otpCode,
            otpExpires: otpExpires,
            isAdmin: isAdmin || false,
        });

        
     

        const emailContent = `
            <h2>Email Verification</h2>
            <p>Hi ${name}, thank thank you for registering with us.</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h3 style="color: #333; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${otpCode}</h3>
            <p>This code is valid for 10 minutes. Please enter it on the verification page.</p>
        `;
        await sendEmail(formattedEmail, 'Verify Your Account - OTP Code', emailContent);

        const token = jwt.sign(
            { id: newUser._id, isAdmin: newUser.isAdmin }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: "Registration successful! A verification code has been sent to your email. Use the token for API access.",
            user: {
                id: newUser._id,
                email: newUser.email,
                isAdmin: newUser.isAdmin, 
            },
            token: token 
        });
    } catch (err) {
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};
export const loginController = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Server error during login.' });
        }
        
        if (!user) {
            return res.status(401).json({ message: info.message || 'Authentication failed' });
        }

        
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

       
        req.logIn(user, (err) => {
            if (err) return next(err);

          
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone_no: user.phone_no,
                   
                    isAdmin: user.isAdmin,
                },
              
                token: token,
            });
        });
    })(req, res, next);
};

export const logoutController = (req, res, next) => {
    req.logout((err) => {
        if (err) { 
            return res.status(500).json({ message: `Logout failed: ${err.message}` });
        }
        
        req.session.destroy((error) => {
            if (error) {
                 return res.status(500).json({ message: "Failed to destroy session data." });
            }
            
            res.status(200).json({ message: "Logged out successfully!" });
        });
    });
};

export const viewProfile = async (req, res) => {
  try {
   
    return res.status(200).json({ 
      message: "Profile fetched successfully", 
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone_no } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { name, email, phone_no },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.otpExpires < Date.now()) {
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
        }

        if (user.otp !== otpCode) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ 
            message: "Email verification successful! You can now log in.",
            isVerified: true
        });

    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).json({ message: "Server error during verification." });
    }
};
export const sendMobileOtp = async (req, res) => {
    try {
        const { phone_no } = req.body;
        
        const user = await User.findOne({ phone_no });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const e164PhoneNumber = `+91${phone_no}`;

        const status = await sendSmsVerification(e164PhoneNumber);

        if (status === 'pending') {
            return res.status(200).json({ message: "Verification code sent to mobile number." });
        } else {
            return res.status(500).json({ message: "Failed to send verification code." });
        }

    } catch (err) {
        console.error("Mobile OTP send error:", err);
        return res.status(500).json({ message: "Server error during OTP dispatch." });
    }
};

export const verifyMobileOtp = async (req, res) => {
    try {
        const { phone_no, otpCode } = req.body;
        
        const user = await User.findOne({ phone_no });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const e164PhoneNumber = `+91${phone_no}`;

        const isApproved = await checkSmsVerification(e164PhoneNumber, otpCode);

        if (isApproved) {
            return res.status(200).json({ message: "Mobile number successfully verified." });
        } else {
            return res.status(400).json({ message: "Invalid verification code." });
        }

    } catch (err) {
        console.error("Mobile OTP verify error:", err);
        return res.status(500).json({ message: "Server error during mobile verification." });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
         
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        
        const resetCode = generateOTP(); 
        
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

       
        const mailContent = `
            <p>You requested a password reset. Your 6-digit reset code is:</p>
            <h3>${resetCode}</h3>
            <p>This code is valid for 1 hour.</p>`;
        await sendEmail(email, 'Password Reset Request', mailContent);

        res.status(200).json({ message: 'Password reset code sent to your email.' });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, OTP, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Reset OTP has expired. Please request a new one." });
        }

        if (user.resetPasswordToken !== OTP) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        await sendEmail(email, "Password Successfully Changed", "Your password has been updated.");

        return res.status(200).json({
            message: "Password reset successful. You can now log in."
        });

    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` });
    }
};


export const resendOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        const formattedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: formattedEmail });
        
        if (!user) {
            return res.status(200).json({ message: "If the account exists, a new code has been processed." });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified. Please log in." });
        }

        const newOtpCode = generateOTP();
        const newOtpExpires = Date.now() + 10 * 60 * 1000;

        user.otp = newOtpCode;
        user.otpExpires = newOtpExpires;
        await user.save();

        const emailContent = `
            <h2>New Verification Code Requested</h2>
            <p>Your new One-Time Password (OTP) is:</p>
            <h3 style="color: #333; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${newOtpCode}</h3>
            <p>This code is valid for 10 minutes.</p>
        `;
        await sendEmail(formattedEmail, 'New Verification Code', emailContent);

        res.status(200).json({
            message: "New verification code sent successfully to your email.",
        });

    } catch (err) {
        console.error("Resend OTP error:", err);
        res.status(500).json({ message: "Server error. Could not resend OTP." });
    }
};



export const deleteUser = async (req, res) => {
  try {
    const { error } = deleteUserSchema.validate({ userId: req.params.userId });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete users.",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
