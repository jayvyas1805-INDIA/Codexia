import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import { createAttempt, submitAttempt, getAttemptsByUser } from '../controllers/BestPracticeAttemptController.js';

const router = express.Router();

router.post('/', protect, createAttempt);
router.post('/:id/submit', protect, submitAttempt);
router.get('/user/:userId', protect, getAttemptsByUser);

export default router;
