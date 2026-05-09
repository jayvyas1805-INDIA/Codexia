import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from '../controllers/CommentController.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/post/:postId', getCommentsByPost);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
