import express from 'express';
import adminController from '../controllers/adminController.js';
// const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/distribute-rewards',
  // protect,
  // restrictTo('admin'),
  adminController.distributeRewards
);

export default router;

