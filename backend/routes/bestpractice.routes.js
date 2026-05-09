import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import {
  createBestPractice,
  getBestPractices,
  getBestPracticeById,
  updateBestPractice,
  deleteBestPractice,
} from '../controllers/BestPracticeController.js';

const router = express.Router();

router.post('/', protect, createBestPractice);
router.get('/', getBestPractices);
router.get('/:id', getBestPracticeById);
router.put('/:id', protect, updateBestPractice);
router.delete('/:id', protect, deleteBestPractice);

export default router;
