import BestPractice from "../models/BestPractice.js";

export const createBestPractice = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required' });

    const bp = await BestPractice.create({ title, content, tags: tags || [], createdBy: req.user.id });
    res.status(201).json({ success: true, data: bp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestPractices = async (req, res) => {
  try {
    const list = await BestPractice.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestPracticeById = async (req, res) => {
  try {
    const bp = await BestPractice.findById(req.params.id).lean();
    if (!bp) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: bp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBestPractice = async (req, res) => {
  try {
    const bp = await BestPractice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bp) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: bp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBestPractice = async (req, res) => {
  try {
    await BestPractice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
