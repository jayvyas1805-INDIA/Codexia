import mongoose from "mongoose";

const schema = new mongoose.Schema({
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

  status: {
    type: String,
    enum: ["active", "suspended", "banned"],
    default: "active",
  },

  warnings: {
    type: Number,
    default: 0,
  },

  banStatus: {
    type: {
      type: String,
      enum: ["temporary", "permanent"],
    },
    expiresAt: Date,
  },
});

schema.index({ community: 1, user: 1 }, { unique: true });

const CommunityUserState =
  mongoose.models.CommunityUserState ||
  mongoose.model("CommunityUserState", schema);

export default CommunityUserState;