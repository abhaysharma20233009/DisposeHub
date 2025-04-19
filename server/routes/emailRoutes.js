import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Email sending route
router.get('/send-email/:uid', sendEmail);

export default router;
