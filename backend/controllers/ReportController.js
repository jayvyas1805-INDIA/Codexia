import Report from "../models/Report.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

export const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({
        success: false,
        message: "targetType, targetId and reason required",
      });
    }

    // SIMPLE CHECK: same user cannot report same post again
    const oldReport = await Report.findOne({
      reporter: req.user.id,
      targetType: targetType,
      targetId: targetId,
    });

    if (oldReport) {
      return res.status(400).json({
        success: false,
        message: "You already reported this post.",
      });
    }

    const report = await Report.create({
      reporter: req.user.id,
      targetType: targetType,
      targetId: targetId,
      reason: reason,
      description: description,
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      data: report,
    });
  } catch (error) {
    console.log("CREATE REPORT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const reports = await Report.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).lean();
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { action } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (action === "remove_post" && report.targetType === "post") {
      await Post.findByIdAndUpdate(report.targetId, {
        status: "removed",
      });
    }

    if (action === "remove_comment" && report.targetType === "comment") {
      await Comment.findByIdAndUpdate(report.targetId, {
        status: "removed",
      });
    }

    if (action === "suspend_user" && report.targetType === "user") {
      await User.findByIdAndUpdate(report.targetId, {
        status: "suspended",
      });
    }

    if (action === "dismiss") {
      report.status = "dismissed";
      report.resolution = "dismissed";
    } else {
      report.status = "resolved";
      report.resolution = action || "resolved";
    }

    report.resolvedBy = req.user.id;
    report.resolvedAt = new Date();

    await report.save();

    await ActivityLog.create({
      category: "moderation",
      action: "Report Resolved",
      performedBy: req.user.id,
      description: `Report ${report._id} resolved with action ${action}`,
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dismissReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'dismissed', resolvedBy: req.user.id, resolvedAt: new Date() }, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
