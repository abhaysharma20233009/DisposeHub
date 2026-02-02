import express from "express";
import transactionController from "../controllers/transactionController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/my",
  protect,
  transactionController.getMyTransactions
);

//get all transactons for admin
router.get(
  "/",
  protect,
  restrictTo("admin"),
  transactionController.getAllTransactions
);

export default router;
