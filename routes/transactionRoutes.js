// routes/transactionRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";

import {
  transactionFilterSchema,
  walletTransactionFilterSchema,
  reportFilterSchema,
} from "../validator/transactionValidator.js";

import {
  getWalletTransactionsAdmin,
  getBookingTransactionsAdmin,
  getCouponUsageAdmin,
  getReferralRewardsAdmin,
  getFinancialReportAdmin,
  getAuditLogsAdmin,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get(
  "/wallet",
  authMiddleware,
  isAdmin,
  validateRequest(walletTransactionFilterSchema, "query"),
  getWalletTransactionsAdmin
);

router.get(
  "/bookings",
  authMiddleware,
  isAdmin,
  validateRequest(transactionFilterSchema, "query"),
  getBookingTransactionsAdmin
);

router.get(
  "/coupons",
  authMiddleware,
  isAdmin,
  validateRequest(transactionFilterSchema, "query"),
  getCouponUsageAdmin
);

router.get(
  "/referrals",
  authMiddleware,
  isAdmin,
  validateRequest(transactionFilterSchema, "query"),
  getReferralRewardsAdmin
);

router.get(
  "/report",
  authMiddleware,
  isAdmin,
  validateRequest(reportFilterSchema, "query"),
  getFinancialReportAdmin
);

router.get(
  "/audit-logs",
  authMiddleware,
  isAdmin,
  validateRequest(transactionFilterSchema, "query"),
  getAuditLogsAdmin
);

export default router;
