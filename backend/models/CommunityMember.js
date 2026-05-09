import mongoose from "mongoose";

const communityMemberSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

communityMemberSchema.index(
  { community: 1, user: 1 },
  { unique: true }
);

const CommunityMember =
  mongoose.models.CommunityMember ||
  mongoose.model("CommunityMember", communityMemberSchema);

export default CommunityMember;
