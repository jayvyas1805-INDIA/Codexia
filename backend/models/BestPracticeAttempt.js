import mongoose from "mongoose";

const bestPracticeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bestPractice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BestPractice",
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java", "cpp", "csharp", "go", "rust", "typescript"],
    },
    code: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete", "submitted", "reviewing"],
      default: "incomplete",
    },
    testResults: [
      {
        testName: String,
        passed: Boolean,
        expected: String,
        actual: String,
        error: String,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
    executionTime: Number,
    memoryUsed: Number,
    creditEarned: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    submittedCount: {
      type: Number,
      default: 0,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

// Create a compound index to track user's attempts on specific best practices
bestPracticeAttemptSchema.index({ user: 1, bestPractice: 1 });
bestPracticeAttemptSchema.index({ user: 1, createdAt: -1 });
bestPracticeAttemptSchema.index({ bestPractice: 1 });
bestPracticeAttemptSchema.index({ status: 1 });
bestPracticeAttemptSchema.index({ completedAt: 1 });

const BestPracticeAttempt = mongoose.model("BestPracticeAttempt", bestPracticeAttemptSchema);
export default BestPracticeAttempt;
