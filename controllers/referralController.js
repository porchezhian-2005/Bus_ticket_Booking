
import User from "../models/User.js";
import Referral from "../models/Referral.js";

export const applyReferralCode = async (req, res) => {
  const { referralCode } = req.body;
  const user = req.user;

  if (user.referredBy) {
    return res.status(400).json({ message: "Referral already used." });
  }

  const referrer = await User.findOne({ referralCode });
  if (!referrer) {
    return res.status(400).json({ message: "Invalid referral code." });
  }

  if (referrer._id.toString() === user._id.toString()) {
    return res.status(400).json({ message: "You cannot use your own referral code." });
  }

  user.referredBy = referralCode;
  await user.save();

  await Referral.create({
    referrer: referrer._id,
    referee: user._id
  });

  return res.status(200).json({ message: "Referral code applied successfully." });
};

export const markReferralSuccessful = async (refereeId) => {
  const referral = await Referral.findOne({ referee: refereeId });

  if (!referral) return;

  referral.status = "successful";
  await referral.save();

  const referrer = await User.findById(referral.referrer);

  referrer.wallet = (referrer.wallet || 0) + referral.rewardAmount;
  await referrer.save();
};

export const getReferralStats = async (req, res) => {
  const user = req.user;

  const referrals = await Referral.find({ referrer: user._id });

  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter(r => r.status === "successful").length;
  const earnings = successfulReferrals * 500;

  res.json({
    totalReferrals,
    successfulReferrals,
    earnings
  });
};

export const getReferredUsers = async (req, res) => {
  const user = req.user;

  const list = await Referral.find({ referrer: user._id })
    .populate("referee", "name email phone_no");

  res.json(list);
};

export const getAllReferralsAdmin = async (req, res) => {
  const all = await Referral.find()
    .populate("referrer", "name email")
    .populate("referee", "name email");

  res.json(all);
};
