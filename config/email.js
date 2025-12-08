import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,             
    secure: true,         
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully. Message ID:", info.messageId);

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email. Please check server logs.");
    }
};