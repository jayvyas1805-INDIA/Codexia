import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";

// Get paginated list of users (admin/moderator)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password") // give paginated list exclude the password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update own profile (bio, avatarColor, profilePicture)
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowed = ["bio", "avatarColor", "profilePicture", "profilePic"];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update user (role, status, warnings, banStatus)
export const adminUpdateUser = async (req, res) => {
  try {
    const { role, status, warnings, banStatus } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (typeof warnings !== 'undefined') updates.warnings = warnings;
    if (banStatus) updates.banStatus = banStatus;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    // Log activity
    try {
      await ActivityLog.create({
        action: "Role Changed",
        description: `Admin ${req.user.id} updated user ${user._id}`,
        performedBy: req.user.id,
        targetUser: user._id,
        category: "user_management",
      });
    } catch (e) {}

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password (self)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both current and new password required' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
