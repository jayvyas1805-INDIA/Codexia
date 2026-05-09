import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
} from '../controllers/ChatController.js';

const router = express.Router();

router.get('/:communityId', protect, getMessages);
router.post('/:communityId', protect, sendMessage);
router.put('/msg/:id', protect, editMessage);
router.delete('/msg/:id', protect, deleteMessage);
router.post('/msg/:id/react', protect, reactToMessage);

export default router;
