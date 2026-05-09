import Problem from "../models/Problem.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      languages,
      examples,
      tags,
      constraints,
      hints,
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Title, description and difficulty required",
      });
    }

    const allowedDifficulty = ["easy", "medium", "hard"];

    if (!allowedDifficulty.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Difficulty must be easy, medium or hard",
      });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty: difficulty.toLowerCase(),
      languages: languages || {},
      examples: examples || [],
      tags: tags || [],
      constraints: constraints || [],
      hints: hints || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.community) filter.community = req.query.community;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const problems = await Problem.find(filter)
      .populate("community", "name icon")
      .populate("createdBy", "username profilePicture avatarColor reputation")
      .sort({ solvedCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("community", "name icon description")
      .populate("createdBy", "username profilePicture avatarColor reputation")
      .lean();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const updates = req.body;
    const problem = await Problem.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
