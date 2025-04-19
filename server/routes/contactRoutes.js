// routes/contactRoutes.js
import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact/:uid', submitContactForm);

export default router;
