export const generateCouponCode = () => {
  const prefix = "CPN";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${random}`;
};
