import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  changePostStatus,
  incrementViews,
  getPostsByCommunity
} from '../controllers/PostController.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get("/community/:communityId", getPostsByCommunity);
router.get("/:id", getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/views', incrementViews);
router.post('/:id/status', protect, changePostStatus);
router.get("/community/:communityId", getPostsByCommunity);

export default router;
