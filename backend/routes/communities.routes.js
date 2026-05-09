import express from "express";
import protect from "../middlewares/AuthMiddle.js";
import authorizeRoles from "../middlewares/AuthRole.js";
import isModeratorUser from "../middlewares/isModeratorUser.js";

import {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  approveCommunity,
  addModerator,

} from "../controllers/CommunityController.js";

const router = express.Router();

router.post("/", protect, createCommunity);
router.get("/", getCommunities);
router.get("/:id", getCommunityById);

router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);

router.post("/:id/approve", protect, authorizeRoles("ADMIN"), approveCommunity);
router.post("/:id/add-moderator", protect, authorizeRoles("ADMIN"), addModerator);

// router.get(
//   "/moderator-dashboard",
//   getModeratorCommunityDashboard
// );
export default router;