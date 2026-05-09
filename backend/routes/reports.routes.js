import express from 'express';
import protect from '../middlewares/AuthMiddle.js';
import authorizeRoles from '../middlewares/AuthRole.js';
import { createReport, getReports, getReportById, resolveReport, dismissReport } from '../controllers/ReportController.js';
import isModeratorUser from '../middlewares/isModeratorUser.js';

const router = express.Router();

router.post("/", protect, createReport);

// admin sees all reports
router.get("/", protect, authorizeRoles("ADMIN"), getReports);

// admin + moderator can act
router.get("/:id", protect, isModeratorUser, getReportById);
router.post("/:id/resolve", protect, isModeratorUser, resolveReport);
router.post("/:id/dismiss", protect, isModeratorUser, dismissReport);

export default router;
