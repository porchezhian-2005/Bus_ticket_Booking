import SystemConfig from "../models/SystemConfig.js";


const getOrCreateConfig = async () => {
  let config = await SystemConfig.findOne();
  if (!config) {
    config = await SystemConfig.create({});
  }
  return config;
};

export const getSystemConfig = async (req, res) => {
  const config = await getOrCreateConfig();
  return res.status(200).json({ success: true, config });
};

export const updateWalletConfig = async (req, res) => {
  const config = await getOrCreateConfig();
  config.maxWalletUse = req.body.maxWalletUse;
  await config.save();

  return res.status(200).json({
    success: true,
    message: "Wallet usage percentage updated.",
    config
  });
};

export const updateReferralConfig = async (req, res) => {
  const config = await getOrCreateConfig();
  config.referralReward = req.body.referralReward;
  await config.save();

  return res.status(200).json({
    success: true,
    message: "Referral reward updated.",
    config
  });
};
