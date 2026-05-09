import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import authorizeRoles from '../middlewares/AuthRole.js';
import {
  getUsers,
  getUserById,
  getUserByUsername,
  updateProfile,
  adminUpdateUser,
  changePassword,
} from '../controllers/UserController.js';
import isModeratorUser from "../middlewares/isModeratorUser.js";

const router = express.Router();


router.get(
  '/',
  protect,
  isModeratorUser,   // ✅ community-based check
  getUsers
);
router.get('/by-username/:username', getUserByUsername);
router.get('/:id', protect, getUserById);
router.put('/me', protect, updateProfile);
router.put('/:id', protect, authorizeRoles('ADMIN'), adminUpdateUser);
router.post('/change-password', protect, changePassword);

export default router;
