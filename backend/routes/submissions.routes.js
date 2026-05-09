import express from "express";
import protect from "../middlewares/AuthMiddle.js";
import isModeratorUser from "../middlewares/isModeratorUser.js";

import {
  createSubmission,
  getSubmissionsByUser,
  getSubmissionsByProblem,
  updateSubmission,
} from "../controllers/SubmissionController.js";

const router = express.Router();

router.post("/", protect, createSubmission);

router.get("/user/:userId", protect, getSubmissionsByUser);

router.get(
  "/problem/:problemId",
  protect,
  isModeratorUser,
  getSubmissionsByProblem
);

router.put("/:id", protect, isModeratorUser, updateSubmission);

export default router;