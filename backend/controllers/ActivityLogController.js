import ActivityLog from "../models/ActivityLog.js";

export const createLog = async (req, res) => {
  try {
    const log = await ActivityLog.create({
      action: req.body.action,
      description: req.body.description || '',
      performedBy: req.user ? req.user.id : null,
      category: req.body.category || 'general',
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await ActivityLog.countDocuments(filter);
    res.json({ success: true, data: logs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
