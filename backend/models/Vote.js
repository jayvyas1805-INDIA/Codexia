import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: undefined,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: undefined,
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
  },
  { timestamps: true }
);

voteSchema.index(
  { user: 1, post: 1 },
  {
    unique: true,
    partialFilterExpression: {
      post: { $type: "objectId" },
    },
  }
);

voteSchema.index(
  { user: 1, comment: 1 },
  {
    unique: true,
    partialFilterExpression: {
      comment: { $type: "objectId" },
    },
  }
);

voteSchema.index({ post: 1 });
voteSchema.index({ comment: 1 });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;