import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const { postId, parentId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "postId and content required",
      });
    }

    const comment = await Comment.create({
      post: postId,
      parentComment: parentId || null,
      author: req.user.id,
      content,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
      $inc: { commentCount: 1 },
    });

    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id },
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username profilePicture reputation")
      .lean();

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username profilePicture reputation")
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && req.user.role === 'USER') return res.status(403).json({ success: false, message: 'Unauthorized' });

    if (req.body.content !== undefined) comment.content = req.body.content;
    await comment.save();

    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id && req.user.role === 'USER') return res.status(403).json({ success: false, message: 'Unauthorized' });

    await comment.deleteOne();
    try { await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id }, $inc: { commentCount: -1 } }); } catch (e) { }

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
