import express from 'express';
import {
  addStockEntry,
  getStockEntries,
  getStockEntryById,
  deleteStockEntry,
} from '../controllers/stockController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getStockEntries).post(protect, addStockEntry);

router.route('/:id').get(protect, getStockEntryById).delete(protect, admin, deleteStockEntry);

export default router;
