import Vote from "../models/Vote.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Vote on post or comment
export const createOrUpdateVote = async (req, res) => {
  try {
    const { targetType, targetId, value } = req.body; // value: 1 or -1
    if (!['post', 'comment'].includes(targetType)) return res.status(400).json({ success: false, message: 'Invalid targetType' });
    if (![1, -1].includes(value)) return res.status(400).json({ success: false, message: 'Invalid vote value' });

    // Build query based on targetType
    const query = targetType === 'post' 
      ? { user: req.user.id, post: targetId }
      : { user: req.user.id, comment: targetId };

    // Find existing
    const existing = await Vote.findOne(query);
    if (existing) {
      if (existing.value === value) {
        // remove vote
        await existing.deleteOne();
        
        // Update counters - remove the vote
        if (targetType === 'post') {
          if (value === 1) {
            await Post.findByIdAndUpdate(targetId, { 
              $inc: { upvotes: -1, voteCount: -1 } 
            });
          } else {
            await Post.findByIdAndUpdate(targetId, { 
              $inc: { downvotes: -1, voteCount: 1 } 
            });
          }
        } else {
          if (value === 1) {
            await Comment.findByIdAndUpdate(targetId, { 
              $inc: { upvotes: -1, voteCount: -1 } 
            });
          } else {
            await Comment.findByIdAndUpdate(targetId, { 
              $inc: { downvotes: -1, voteCount: 1 } 
            });
          }
        }
        return res.json({ success: true, message: 'Vote removed' });
      }

      // flip vote - from upvote to downvote or vice versa
      const oldValue = existing.value;
      existing.value = value;
      await existing.save();

      if (targetType === 'post') {
        if (oldValue === 1 && value === -1) {
          // was upvote, now downvote
          await Post.findByIdAndUpdate(targetId, { 
            $inc: { upvotes: -1, downvotes: 1, voteCount: -2 } 
          });
        } else {
          // was downvote, now upvote
          await Post.findByIdAndUpdate(targetId, { 
            $inc: { upvotes: 1, downvotes: -1, voteCount: 2 } 
          });
        }
      } else {
        if (oldValue === 1 && value === -1) {
          await Comment.findByIdAndUpdate(targetId, { 
            $inc: { upvotes: -1, downvotes: 1, voteCount: -2 } 
          });
        } else {
          await Comment.findByIdAndUpdate(targetId, { 
            $inc: { upvotes: 1, downvotes: -1, voteCount: 2 } 
          });
        }
      }

      return res.json({ success: true, message: 'Vote updated' });
    }

    // create new - map to correct field based on targetType
    const voteData = {
      user: req.user.id,
      value
    };
    if (targetType === 'post') {
      voteData.post = targetId;
    } else {
      voteData.comment = targetId;
    }

    await Vote.create(voteData);
    
    // Add new vote
    if (targetType === 'post') {
      if (value === 1) {
        await Post.findByIdAndUpdate(targetId, { 
          $inc: { upvotes: 1, voteCount: 1 } 
        });
      } else {
        await Post.findByIdAndUpdate(targetId, { 
          $inc: { downvotes: 1, voteCount: -1 } 
        });
      }
    } else {
      if (value === 1) {
        await Comment.findByIdAndUpdate(targetId, { 
          $inc: { upvotes: 1, voteCount: 1 } 
        });
      } else {
        await Comment.findByIdAndUpdate(targetId, { 
          $inc: { downvotes: 1, voteCount: -1 } 
        });
      }
    }

    res.status(201).json({ success: true, message: 'Voted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVotesForTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const query = targetType === 'post' 
      ? { post: targetId }
      : { comment: targetId };
    const votes = await Vote.find(query).lean();
    res.json({ success: true, data: votes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
