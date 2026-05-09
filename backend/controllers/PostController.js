import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";
import ActivityLog from "../models/ActivityLog.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, community, tags, isDraft } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content required",
      });
    }

    const post = await Post.create({
      title,
      content,
      community,
      tags: tags || [],
      author: req.user.id,
      status: isDraft ? "pending" : "approved",
    });

    if (community) {
      await Community.findByIdAndUpdate(community, {
        $inc: { postCount: 1 },
        $push: { posts: post._id },
      });
    }

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all posts with filters and pagination
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.community) filter.community = req.query.community;
    if (req.query.author) filter.author = req.query.author;

    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = "approved";
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const posts = await Post.find(filter)
      .populate("author", "username profilePicture avatarColor reputation")
      .populate("community", "name icon")
      .sort({
        isPinned: -1,
        isAnnouncement: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
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

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePicture reputation")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role === "USER") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allowed = ["title", "content", "tags", "status"];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        post[key] = req.body[key];
      }
    });

    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role === "USER") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    if (post.community) {
      await Community.findByIdAndUpdate(post.community, {
        $inc: { postCount: -1 },
        $pull: { posts: post._id },
      });
    }

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change post status
export const changePostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    try {
      await ActivityLog.create({
        action: "Content Approved",
        category: "content_moderation",
        performedBy: req.user.id,
        targetPost: post._id,
        description: `Post status set to ${status}`,
      });
    } catch (e) {
      console.log("Activity log failed:", e.message);
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Increment post views
export const incrementViews = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      data: {
        views: post.views,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get posts of one community
export const getPostsByCommunity = async (req, res) => {
  try {
    const posts = await Post.find({
      community: req.params.communityId,
      status: "approved",
    })
      .populate("author", "username profilePicture avatarColor reputation")
      .populate("community", "name icon")
      .sort({
        isPinned: -1,
        isAnnouncement: -1,
        createdAt: -1,
      })
      .lean();

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};