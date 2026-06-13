import express from 'express';
import { createBike, getBikes, updateBike, deleteBike } from '../controllers/bikeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBikes)
  .post(protect, upload.single('image'), createBike);

router.route('/:id')
  .put(protect, upload.single('image'), updateBike)
  .delete(protect, admin, deleteBike);

export default router;
