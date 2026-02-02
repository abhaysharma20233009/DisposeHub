import express from 'express';
const router =  express.Router();
import walletController from "../controllers/walletController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

// Admin rewards user
router.post(
  '/reward',
  protect,
  restrictTo('admin'),
  walletController.rewardUser);

// User withdraws
router.post(
  "/withdraw",
  protect,
  walletController.withdraw
);



export default router;

