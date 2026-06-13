import express from 'express';
import { createSale, getSales } from '../controllers/saleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSales)
  .post(protect, createSale);

export default router;
