import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    language: {
      type: String,
      required: true,
      enum: [
        "javascript",
        "python",
        "java",
        "cpp",
        "csharp",
        "go",
        "rust",
        "typescript",
      ],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "accepted",
        "wrong",
        "runtime error",
        "time limit exceeded",
      ],
      default: "pending",
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memoryUsed: {
      type: Number,
      default: 0,
    },
    testResults: [
      {
        testCase: String,
        passed: Boolean,
        expected: String,
        actual: String,
        error: String,
      },
    ],
    feedback: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    creditEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ createdAt: -1 });

const Submit = mongoose.model("Submit", submissionSchema);
export default Submit;