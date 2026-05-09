import Community from "../models/Community.js";
import Report from "../models/Report.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import CommunityMember from "../models/CommunityMember.js";


export const getModeratorDashboardOverview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User id not found in token",
      });
    }

    const communityFilter =
      req.user.role === "ADMIN"
        ? {}
        : { moderators: userId };

    const communities = await Community.find(communityFilter)
      .populate("members", "username email role status createdAt")
      .populate("moderators", "username email role status");

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const data = [];

    for (const community of communities) {
      const posts = await Post.find({
        community: community._id,
        status: "approved",
      })
        .populate("author", "username email profilePicture")
        .sort({
          isPinned: -1,
          isAnnouncement: -1,
          createdAt: -1,
        });

      const postIds = posts.map((p) => p._id);

      const reports = await Report.find({
        targetType: "post",
        targetId: { $in: postIds },
      }).sort({ createdAt: -1 });

      const activityLogs = await ActivityLog.find({
        targetCommunity: community._id,
      })
        .populate("performedBy", "username email")
        .sort({ createdAt: -1 })
        .limit(5);

      const announcements = posts.filter(
        (post) => post.isAnnouncement === true
      );

      const members = community.members || [];
      const moderators = community.moderators || [];

      data.push({
        _id: community._id,
        name: community.name,
        description: community.description,
        icon: community.icon,

        members,
        membersCount: members.length,

        moderators,
        moderatorsCount: moderators.length,

        posts,
        postCount: posts.length,

        todayPostsCount: posts.filter(
          (p) => new Date(p.createdAt) >= todayStart
        ).length,

        reports,
        activeReportsCount: reports.filter((r) => r.status === "pending")
          .length,

        activityLogs,
        announcements,
      });
    }

    res.json({
      success: true,
      data: {
        communities: data,
      },
    });
  } catch (error) {
    console.error("getModeratorDashboardOverview error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getModeratorCommunityUsers = async (req, res) => {
  try {
    const community = await Community.findOne({
      _id: req.params.communityId,
      moderators: req.user.id,
    })
      .select("name members moderators")
      .populate(
        "members",
        "username email role status warnings banStatus joinDate createdAt totalPosts totalComments"
      )
      .populate("moderators", "username email role status");

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "You are not moderator of this community",
      });
    }

    res.json({
      success: true,
      data: {
        community,
        users: community.members,
        moderators: community.moderators,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getModeratorCommunityPosts = async (req, res) => {
  try {
    const community = await Community.findOne({
      _id: req.params.communityId,
      moderators: req.user.id,
    }).select("_id");

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "You are not moderator of this community",
      });
    }

    const posts = await Post.find({
      community: req.params.communityId,
    })
      .select("title content status author createdAt likes comments")
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import CommunityUserState from "../models/CommunityUserState.js";

export const moderateCommunityUser = async (req, res) => {
  try {
    const { communityId, userId } = req.params;
    const { action, banType, banDays, warningReason } = req.body;

    const community = await Community.findOne({
      _id: communityId,
      moderators: req.user.id,
    });

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "Not a moderator",
      });
    }

    const userState = await CommunityUserState.findOneAndUpdate(
      {
        community: communityId,
        user: userId,
      },
      {
        $setOnInsert: {
          community: communityId,
          user: userId,
        },
      },
      { upsert: true, new: true }
    );

    if (action === "warn") {
      userState.warnings += 1;
    }

    if (action === "suspend") {
      userState.status = "suspended";
      userState.banStatus = {
        type: "temporary",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (action === "ban") {
      userState.status = "banned";

      if (banType === "temporary") {
        userState.banStatus = {
          type: "temporary",
          expiresAt: new Date(
            Date.now() + banDays * 24 * 60 * 60 * 1000
          ),
        };
      } else {
        userState.banStatus = {
          type: "permanent",
        };
      }
    }

    await userState.save();

    res.json({
      success: true,
      data: userState,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getModeratorCommunityReports = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findOne({
      _id: communityId,
      moderators: req.user.id,
    });

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "You are not moderator of this community",
      });
    }

    const posts = await Post.find({ community: communityId }).select("_id");
    const postIds = posts.map((p) => p._id);

    const reports = await Report.find({
      $or: [
        { targetType: "post", targetId: { $in: postIds } },
        { targetType: "user", targetId: { $in: community.members } },
      ],
    })
      .populate("reporter", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getModeratorDashboard = async (req, res) => {
  try {
    const { communityId } = req.params;

    // ✅ CASE 1: If communityId is NOT passed → return ALL moderated communities
    if (!communityId) {
      const communities = await Community.find({
        moderators: req.user.id,
      });

      return res.json({
        success: true,
        data: communities,
      });
    }

    // ✅ CASE 2: If specific community requested
    const community = await Community.findOne({
      _id: communityId,
      moderators: req.user.id,
    })
      .populate("members", "username email role status createdAt")
      .populate("moderators", "username email role status");

    if (!community) {
      return res.status(403).json({
        success: false,
        message: "You are not moderator of this community",
      });
    }

    const posts = await Post.find({ community: communityId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    const postIds = posts.map((p) => p._id);

    const reports = await Report.find({
      targetType: "post",
      targetId: { $in: postIds },
    }).sort({ createdAt: -1 });

    const activities = await ActivityLog.find({
      targetCommunity: communityId,
    })
      .populate("performedBy", "username email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        community,
        posts,
        reports,
        activities,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createModeratorAnnouncement = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, content, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content required",
      });
    }

    const community = await Community.findOne({
      _id: communityId,
      moderators: req.user.id,
    });

    if (!community && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const announcement = await Post.create({
      title,
      content,
      author: req.user.id,
      community: communityId,
      status: "approved",
      isAnnouncement: true,
      isPinned: !!isPinned,
      tags: ["announcement"],
    });

    await Community.findByIdAndUpdate(communityId, {
      $push: { posts: announcement._id },
      $inc: { postCount: 1 },
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const toggleAnnouncementPin = async (req, res) => {
  try {
    const { communityId, postId } = req.params;

    const community = await Community.findOne({
      _id: communityId,
      moderators: req.user.id,
    });

    if (!community && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const post = await Post.findOne({
      _id: postId,
      community: communityId,
      isAnnouncement: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};