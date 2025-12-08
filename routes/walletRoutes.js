import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import {
  walletPaySchema,
  walletAddMoneySchema,
  walletConfigUpdateSchema,
  paginationSchema
} from "../validator/walletValidator.js";
import {
  getMyWallet,
  getMyWalletTransactions,
  addMoneyToWallet,
  payWithWallet,
  updateWalletConfig
} from "../controllers/walletController.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getMyWallet
);

router.get(
  "/transactions",
  authMiddleware,
  validateRequest(paginationSchema, "query"),
  getMyWalletTransactions
);

router.post(
  "/add-money",
  authMiddleware,
  validateRequest(walletAddMoneySchema),
  addMoneyToWallet
);

router.post(
  "/pay",
  authMiddleware,
  validateRequest(walletPaySchema),
  payWithWallet
);

router.put(
  "/config/max-usage",
  authMiddleware,
  isAdmin,
  validateRequest(walletConfigUpdateSchema),
  updateWalletConfig
);

export default router;
