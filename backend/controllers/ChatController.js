import Chat from "../models/Chat.js";

export const getMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const limit = parseInt(req.query.limit) || 200;

    const messages = await Chat.find({ community: communityId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate('sender', 'username profilePicture');

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { message, attachments } = req.body;
    if (!message && (!attachments || attachments.length === 0)) return res.status(400).json({ success: false, message: 'Message or attachments required' });

    const msg = await Chat.create({ community: communityId, sender: req.user.id, message, attachments: attachments || [] });

    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const msg = await Chat.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (msg.sender.toString() !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (req.body.message !== undefined) msg.message = req.body.message;
    msg.isEdited = true;
    await msg.save();

    res.json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const msg = await Chat.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (msg.sender.toString() !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await msg.deleteOne();
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { reaction } = req.body;
    const msg = await Chat.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    msg.reactions = msg.reactions || [];
    msg.reactions.push({ user: req.user.id, emoji: reaction });
    await msg.save();

    res.json({ success: true, data: msg.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
