import mongoose from "mongoose";

const moderatorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    permissions: {
      type: [String],
      enum: [
        "MANAGE_POSTS",
        "MANAGE_MEMBERS",
        "MANAGE_REPORTS",
        "MANAGE_RULES",
      ],
      default: ["MANAGE_POSTS", "MANAGE_REPORTS"],
    },

    status: {
      type: String,
      enum: ["active", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

moderatorSchema.index({ user: 1, community: 1 }, { unique: true });

const Moderator = mongoose.model("Moderator", moderatorSchema);
export default Moderator;