import crypto from "crypto";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = (length = 20) => {
  return crypto.randomBytes(length).toString("hex");
};
