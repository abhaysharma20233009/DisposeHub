import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { saveLocation, getActiveLocations, deactivateLocation } from '../controllers/LocationController.js';

const router = express.Router();

router.post('/save', protect, restrictTo('user'), saveLocation);
router.get('/active-locations', getActiveLocations);
router.patch('/:id/deactivate', deactivateLocation);

export default router;
