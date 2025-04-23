// routes/contactRoutes.js
import express from 'express';
import { deleteContact, getAllContacts, submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

router.post('/:uid', submitContactForm);


router.get('/admin/messages', getAllContacts);
router.delete('/admin/messages/:id', deleteContact);
export default router;
