import express from 'express';
import { saveLocation, getActiveLocations, deactivateLocation } from '../controllers/LocationController.js';

const router = express.Router();

router.post('/save', saveLocation);
router.get('/active-locations', getActiveLocations);
router.patch('/:id/deactivate', deactivateLocation);

export default router;
