import express from "express";
import transactionController from "../controllers/transactionController.js";
import walletController from "../controllers/walletController.js"
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/my",
  protect,
  transactionController.getMyTransactions
);

// User withdraws
router.post(
  "/withdraw",
  protect,
  walletController.withdraw
);

//get all transactons for admin
router.get(
  "/",
  protect,
  restrictTo("admin"),
  transactionController.getAllTransactions
);

export default router;
