import express from 'express';
import { createJump, getJumps, getJumpById, updateJump, deleteJump } from '../controllers/jumpController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getJumps)
  .post(protect, createJump);

router.route('/:id')
  .get(protect, getJumpById)
  .put(protect, updateJump)
  .delete(protect, admin, deleteJump);

export default router;
