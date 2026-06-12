import express from 'express';
import {
  addStockEntry,
  addBulkStockEntry,
  getStockEntries,
  getStockEntryById,
  deleteStockEntry,
} from '../controllers/stockController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getStockEntries).post(protect, vendor, addBulkStockEntry);
router.route('/single').post(protect, addStockEntry);
router.route('/:id').get(protect, getStockEntryById).delete(protect, admin, deleteStockEntry);

export default router;
