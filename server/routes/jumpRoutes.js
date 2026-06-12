import express from 'express';
import { createJump, getJumps, getJumpById, updateJumpStatus, deleteJump } from '../controllers/jumpController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getJumps).post(protect, createJump);
router.route('/:id/status').put(protect, vendor, updateJumpStatus);
router.route('/:id').get(protect, getJumpById).delete(protect, admin, deleteJump);

export default router;
