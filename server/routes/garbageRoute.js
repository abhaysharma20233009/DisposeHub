import express from 'express';
import {
  createGarbage,
  getAllGarbage,
  deleteGarbage,
} from '../controllers/garbageController.js';

const router = express.Router();

router.post('/add', createGarbage);
router.get('/all', getAllGarbage);
router.delete('/delete/:id', deleteGarbage);

export default router;
