import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Email sending route
router.post('/send-email', sendEmail);

export default router;
