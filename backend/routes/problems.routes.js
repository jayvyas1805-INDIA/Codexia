import express from "express";
import protect from "../middlewares/AuthMiddle.js";
import isModeratorUser from "../middlewares/isModeratorUser.js";

import {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../controllers/ProblemController.js";

const router = express.Router();

router.post("/", protect, isModeratorUser, createProblem);
router.get("/", getProblems);
router.get("/:id", getProblemById);
router.put("/:id", protect, isModeratorUser, updateProblem);
router.delete("/:id", protect, isModeratorUser, deleteProblem);

export default router;