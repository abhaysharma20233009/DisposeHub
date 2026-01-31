import express from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import { getContactStatus, sendContactMessage, deleteContact, getAllContacts } from '../controllers/contactController.js';

const router = express.Router();

router.get("/status", protect, getContactStatus);
router.post("/", protect, sendContactMessage);

router.get('/admin/messages', getAllContacts);
router.delete('/admin/messages/:id', deleteContact);
export default router;
