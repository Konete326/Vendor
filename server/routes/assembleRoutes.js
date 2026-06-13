import express from 'express';
import { createAssemble, getAssembles, updateAssemble, deleteAssemble } from '../controllers/assembleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAssembles)
  .post(protect, createAssemble);

router.route('/:id')
  .put(protect, updateAssemble)
  .delete(protect, admin, deleteAssemble);

export default router;
