import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { saveLocation, getActiveLocations, deactivateLocation } from '../controllers/LocationController.js';

const router = express.Router();
router.use(protect)
router.post('/save', restrictTo('user'), saveLocation);
router.get('/active-locations', restrictTo('driver'), getActiveLocations);
router.patch('/:id/deactivate', restrictTo('driver'), deactivateLocation);

export default router;
