import express from 'express';
import { createPart, getParts, getPartById, updatePart, deletePart } from '../controllers/partController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getParts)
  .post(protect, vendor, upload.single('image'), createPart);

router.route('/:id')
  .get(getPartById)
  .put(protect, vendor, upload.single('image'), updatePart)
  .delete(protect, admin, deletePart);

export default router;
