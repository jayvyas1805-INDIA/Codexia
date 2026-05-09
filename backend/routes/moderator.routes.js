import express from "express";
import protect from "../middlewares/AuthMiddle.js";
import isModeratorUser from "../middlewares/isModeratorUser.js";

import {
  getModeratorDashboardOverview,
  getModeratorCommunityUsers,
  getModeratorCommunityPosts,
    moderateCommunityUser,
    getModeratorCommunityReports,
    getModeratorDashboard,
    createModeratorAnnouncement,
    toggleAnnouncementPin
} from "../controllers/ModeratorController.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  isModeratorUser,
  getModeratorDashboardOverview,
);

router.get(
  "/communities/:communityId/users",
  protect,
  isModeratorUser,
  getModeratorCommunityUsers
);

router.get(
  "/communities/:communityId/posts",
  protect,
  isModeratorUser,
  getModeratorCommunityPosts
);
router.patch(
  "/communities/:communityId/users/:userId/action",
  protect,
  isModeratorUser,
  moderateCommunityUser
);
router.get(
  "/communities/:communityId/reports",
  protect,
  isModeratorUser,
  getModeratorCommunityReports
);

router.get(
  "/communities/:communityId/dashboard",
  protect,
  isModeratorUser,
  getModeratorDashboard
);


router.post(
  "/communities/:communityId/announcements",
  protect,
  isModeratorUser,
  createModeratorAnnouncement
);

router.post(
  "/communities/:communityId/announcements/:postId/pin",
  protect,
  isModeratorUser,
  toggleAnnouncementPin
);
export default router;