import mongoose from "mongoose";

const bestPracticeSchema = new mongoose.Schema(
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
      maxlength: 2000,
      minlength: 20,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "code_quality",
        "performance",
        "security",
        "accessibility",
        "testing",
        "documentation",
        "design_patterns",
        "database",
        "api_design",
        "error_handling",
      ],
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    codeExamples: [
      {
        language: String,
        goodExample: String,
        badExample: String,
        explanation: String,
      },
    ],
    keyPoints: [String],
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["article", "video", "documentation", "tutorial"],
        },
      },
    ],
    creditReward: {
      type: Number,
      default: 5,
    },
    languages: [
      {
        type: String,
        enum: ["javascript", "python", "java", "cpp", "csharp", "go", "rust", "typescript"],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    relatedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
bestPracticeSchema.index({ difficulty: 1 });
bestPracticeSchema.index({ category: 1 });
bestPracticeSchema.index({ languages: 1 });
bestPracticeSchema.index({ createdBy: 1 });
bestPracticeSchema.index({ "rating.average": -1 });
bestPracticeSchema.index({ completedCount: -1 });

const BestPractice = mongoose.model("BestPractice", bestPracticeSchema);
export default BestPractice;
