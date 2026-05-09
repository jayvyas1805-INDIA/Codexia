import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import authorizeRoles from '../middlewares/AuthRole.js';
import { createLog, getLogs } from '../controllers/ActivityLogController.js';

const router = express.Router();

router.post('/', protect, createLog);
router.get('/', protect, authorizeRoles('ADMIN'), getLogs);

export default router;
