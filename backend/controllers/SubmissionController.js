import Submit from "../models/Submit.js";
import Problem from "../models/Problem.js";

export const createSubmission = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "problemId, language and code required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const submission = await Submit.create({
      problem: problemId,
      user: req.user.id,
      language,
      code,
      status: "pending",
    });

    problem.submissions.push(submission._id);
    problem.attempts += 1;
    await problem.save();

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubmissionsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const subs = await Submit.find({ user: userId })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: subs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubmissionsByProblem = async (req, res) => {
  try {
    const subs = await Submit.find({
      problem: req.params.problemId,
    })
      .populate("user", "username name email role status")
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: subs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const allowedStatus = ["pending", "approved", "rejected"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission status",
      });
    }

    const submission = await Submit.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    submission.status = status;

    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();

    await submission.save();

    const updatedSubmission = await Submit.findById(submission._id)
      .populate("user", "username name email role status")
      .populate("problem", "title difficulty")
      .lean();

    res.json({
      success: true,
      message: "Submission updated successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};