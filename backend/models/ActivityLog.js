import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "User Created",
        "User Suspended",
        "User Banned",
        "User Promoted",
        "User Demoted",
        "User Deleted",
        "Community Created",
        "Community Approved",
        "Community Rejected",
        "Content Removed",
        "Content Approved",
        "Report Resolved",
        "Post Flagged",
        "Comment Flagged",
        "Password Reset",
        "Role Changed",
        "Moderator Assigned",
        "Warning Issued",
        "Ban Lifted",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    targetComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    targetCommunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    targetReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
    category: {
      type: String,
      enum: [
        "user_management",
        "content_moderation",
        "community_management",
        "security",
        "system",
        "report_handling",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    metadata: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ performedBy: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ category: 1 });
activityLogSchema.index({ severity: 1 });
activityLogSchema.index({ targetUser: 1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
