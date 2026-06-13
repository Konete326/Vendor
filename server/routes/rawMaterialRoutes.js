import express from 'express';
import { createRawMaterial, getRawMaterials, updateRawMaterial, deleteRawMaterial, adjustStock } from '../controllers/rawMaterialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getRawMaterials)
  .post(protect, upload.single('image'), createRawMaterial);

router.route('/:id')
  .put(protect, upload.single('image'), updateRawMaterial)
  .delete(protect, admin, deleteRawMaterial);

router.route('/:id/stock')
  .put(protect, adjustStock);

export default router;
