import express from "express";
import transactionController from "../controllers/transactionController.js";
import walletController from "../controllers/walletController.js"
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();

router.get(
  "/my",
  protect,
  transactionController.getMyTransactions
);

router.post(
  "/withdraw",
  protect,
  walletController.withdraw
);


router.get(
  "/",
  protect,
  restrictTo("admin"),
  transactionController.getAllTransactions
);

export default router;
