import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export const sendSmsVerification = async (phoneNumber, ) => {
    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications.create({ 
                to: phoneNumber, 
                channel: 'sms' 
            });
        return verification.status;
    } catch (error) {
        console.error("Twilio SMS sending error:", error);
        throw new Error('Failed to send SMS verification code.');
    }
};

export const checkSmsVerification = async (phoneNumber, code) => {
    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks.create({ 
                to: phoneNumber, 
                code: code 
            });
        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error("Twilio SMS verification error:", error);
        return false;
    }
};