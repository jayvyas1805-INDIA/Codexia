import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 5,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
      minlength: 20,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      lowercase: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    languages: {
      type: Map,
      of: new mongoose.Schema({
        template: String,
        testCases: [
          {
            description: String,
            input: String,
            expected: String,
          },
        ],
      }),
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    hints: [String],
    creditReward: {
      type: Number,
      default: 10,
    },
    solvedCount: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    tags: [String],
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submit",
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
problemSchema.index({ difficulty: 1 });
problemSchema.index({ createdBy: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ solvedCount: -1 });

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;