import Community from "../models/Community.js";

const isModeratorUser = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user id not found in token",
      });
    }

    const communityId =
      req.params?.communityId ||
      req.params?.id ||
      req.body?.communityId ||
      req.query?.communityId;

    if (req.user.role === "ADMIN") {
      return next();
    }

    if (!communityId) {
      const count = await Community.countDocuments({
        moderators: userId,
      });

      if (count === 0) {
        return res.status(403).json({
          success: false,
          message: "Only moderators can access this page",
        });
      }

      return next();
    }

    const community = await Community.findOne({
      _id: communityId,
      moderators: userId,
    });

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "You are not moderator of this community",
      });
    }

    req.community = community;
    next();
  } catch (error) {
    console.error("isModeratorUser error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default isModeratorUser;