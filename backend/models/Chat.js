import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    reactions: [
      {
        emoji: String,
        users: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  { timestamps: true }
);

// Index for faster queries
chatSchema.index({ community: 1, createdAt: -1 });
chatSchema.index({ sender: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;