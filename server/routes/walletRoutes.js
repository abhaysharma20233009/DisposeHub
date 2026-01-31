import express from 'express';
const router =  express.Router();
import walletController from '../controllers/walletController.js';

// Admin rewards user
router.post('/reward', walletController.rewardUser);

export default router;

