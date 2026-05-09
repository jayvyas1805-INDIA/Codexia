import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetType: {
      type: String,
      enum: ["post"],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Hate speech",
        "Spam content",
        "Misinformation",
        "Harassment",
        "Inappropriate Content",
        "Offensive Language",
        "Phishing",
        "Adult Content",
        "Copyright Violation",
        "Other",
      ],
    },

    description: {
      type: String,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    resolution: {
      type: String,
      maxlength: 1000,
    },

    action: {
      type: String,
      enum: [
        "no_action",
        "warning",
        "content_removed",
        "user_suspended",
        "user_banned",
        "other",
      ],
    },

    resolvedAt: Date,
  },
  { timestamps: true }
);

// Indexes
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ targetId: 1 });
export default mongoose.model("Report", reportSchema);