import Moderator from "../models/Moderator.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import CommunityMember from "../models/communityMember.js";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });

    const existing = await Community.findOne({ name });
    if (existing) return res.status(409).json({ success: false, message: 'Community already exists' });

    const community = await Community.create({ name, description, isPrivate: !!isPrivate, createdBy: req.user.id });

    res.status(201).json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) filter.$text = { $search: req.query.search };

    const items = await Community.find(filter).skip(skip).limit(limit).lean();
    const total = await Community.countDocuments(filter);

    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate('moderators members', 'username profilePicture');
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    res.json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    if (community.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Community not approved yet' });
    }

    if (community.isPrivate) {
      // create join request
      if (!community.joinRequests.some((r) => r.toString() === req.user.id)) {
        community.joinRequests.push(req.user.id);
        await community.save();
      }
      return res.json({ success: true, message: 'Join request submitted' });
    }

    if (!community.members.some((m) => m.toString() === req.user.id)) {
      community.members.push(req.user.id);
      community.membersCount = (community.membersCount || 0) + 1;
      await community.save();
    }

    await CommunityMember.findOneAndUpdate(
      {
        community: community._id,
        user: req.user.id,
      },
      {
        community: community._id,
        user: req.user.id,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({ success: true, message: "Joined community" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    community.members = community.members.filter((m) => m.toString() !== req.user.id);
    community.memberCount = Math.max(0, (community.memberCount || 1) - 1);
    await community.save();

    res.json({ success: true, message: 'Left community' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    try { await ActivityLog.create({ action: 'Community Approved', performedBy: req.user.id, targetCommunity: community._id }); } catch (e) { }
    res.json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addModerator = async (req, res) => {
  try {
    const { userId, permissions } = req.body;

    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const moderator = await Moderator.findOneAndUpdate(
      {
        user: userId,
        community: community._id,
      },
      {
        user: userId,
        community: community._id,
        assignedBy: req.user.id,
        permissions: permissions || ["MANAGE_POSTS", "MANAGE_REPORTS"],
        status: "active",
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (!community.moderators.includes(userId)) {
      community.moderators.push(userId);
      await community.save();
    }

    res.json({
      success: true,
      message: "Moderator added",
      data: moderator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



