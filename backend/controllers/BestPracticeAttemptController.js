import BestPracticeAttempt from "../models/BestPracticeAttempt.js";
import BestPractice from "../models/BestPractice.js";

export const createAttempt = async (req, res) => {
  try {
    const { practiceId } = req.body;
    const practice = await BestPractice.findById(practiceId);
    if (!practice) return res.status(404).json({ success: false, message: 'Practice not found' });

    const attempt = await BestPracticeAttempt.create({ practice: practiceId, user: req.user.id, status: 'in_progress' });
    res.status(201).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { id } = req.params; // attempt id
    const attempt = await BestPracticeAttempt.findById(id);
    if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });

    // For now we mark complete and attach submission data
    attempt.status = 'completed';
    attempt.submission = req.body.submission || {};
    attempt.completedAt = new Date();
    await attempt.save();

    res.json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttemptsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const attempts = await BestPracticeAttempt.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
