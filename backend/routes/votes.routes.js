import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import { createOrUpdateVote, getVotesForTarget } from '../controllers/VoteController.js';

const router = express.Router();

router.post('/', protect, createOrUpdateVote);
router.get('/:targetType/:targetId', getVotesForTarget);

export default router;
