import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["USER","ADMIN"],
      default: "USER",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    profilePic: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    avatarColor: {
      type: String,
      default: "gray",
      enum: ["gray", "blue", "purple", "red", "green", "yellow", "pink"],
    },
    reputation: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    warnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    banStatus: {
      type: {
        type: String,
        enum: ["temporary", "permanent"],
      },
      expiresAt: Date,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    communities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    bestPracticeAttempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BestPracticeAttempt",
      },
    ],
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
userSchema.index({ reputation: -1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);
export default User;