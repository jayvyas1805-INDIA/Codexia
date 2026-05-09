import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import {
  getPostByIdApi,
  getCommentsByPostApi,
  createCommentApi,
  voteApi,
  getVotesApi,
  createReportApi,
} from "../apis/api";
import { getTagLink } from "../lib/tagUtils";
import Navbar from "../components/Navbar";
import "../styles/PostDetail.css";

function CommentThread({ comment, postId, allComments, onRefresh, level = 0 }) {
  const { user } = useContext(AuthContext);

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);


  const commentId = comment._id || comment.id;
  const author = comment.author;

  const replies = allComments.filter(
    (c) => String(c.parentComment) === String(commentId)
  );

  const parentComment = allComments.find(
    (c) => String(c._id || c.id) === String(comment.parentComment)
  );

  const receiverUsername = parentComment?.author?.username;

  useEffect(() => {
    const fetchVote = async () => {
      if (!user) return;

      try {
        const voteData = await getVotesApi("comment", commentId);
        const votes = voteData?.data || [];

        const myVote = votes.find(
          (v) => String(v.user) === String(user._id || user.id)
        );

        if (myVote?.value === 1) setUserVote("up");
        else if (myVote?.value === -1) setUserVote("down");
        else setUserVote(null);
      } catch (err) {
        console.error("Error fetching comment vote:", err);
      }
    };

    fetchVote();
  }, [user, commentId]);

  const handleVote = async (voteType) => {
    if (!user || isVoting) return;

    setIsVoting(true);

    try {
      const newValue = voteType === "up" ? 1 : -1;

      await voteApi({
        targetType: "comment",
        targetId: commentId,
        value: newValue,
      });

      // 🔥 FIX: Update UI instantly
      if (userVote === voteType) {
        setUserVote(null); // remove vote
      } else {
        setUserVote(voteType); // set new vote
      }

      await onRefresh(); // keep data in sync
    } catch (err) {
      console.error("Error voting:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReply = async () => {
    if (!user) {
      alert("Please login to reply.");
      return;
    }

    if (!replyContent.trim()) return;

    try {
      await createCommentApi({
        postId,
        content: replyContent,
        parentId: commentId,
      });

      setReplyContent("");
      setIsReplyOpen(false);
      setShowReplies(true);
      await onRefresh();
    } catch (err) {
      console.error("Error creating reply:", err);
      alert(err.message || "Failed to create reply");
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

    return `${Math.floor(seconds / 2592000)}mo ago`;
  };


  const maxLevel = 4;
  const indentLevel = Math.min(level, maxLevel);
  const indentPixels = indentLevel * 24;

  return (
    <div>
      <div
        style={{ marginLeft: indentLevel > 0 ? `${indentPixels}px` : "0px" }}
        className="relative py-3"
      >
        {/* {indentLevel > 0 && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-400"></div>
            <div className="absolute left-0 top-6 w-4 h-[2px] bg-gray-400"></div>
          </>
        )} */}

        <div className={indentLevel > 0 ? "pl-6" : ""}>
          {/* YOUR EXISTING COMMENT UI */}

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-sm font-bold text-white">
                {author?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600 mb-2">
                <Link
                  to={`/profile/${author?.username}`}
                  className="text-black hover:text-gray-700 font-bold"
                >
                  @{author?.username || "Anonymous"}
                </Link>

                <span>•</span>

                <span className="text-gray-500">
                  {getTimeAgo(comment.createdAt)}
                </span>
              </div>

              <p className="text-gray-700 mb-3 break-words text-sm leading-relaxed">
                {receiverUsername && (
                  <span className="text-blue-600 font-semibold mr-1">
                    @{receiverUsername}
                  </span>
                )}
                {comment.content}
              </p>

              <div className="flex gap-3 text-xs items-center flex-wrap">
                <button
                  onClick={() => handleVote("up")}
                  disabled={!user || isVoting}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${!user || isVoting
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : userVote === "up"
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                >
                  ▲ {comment.upvotes || 0}
                </button>

                <button
                  onClick={() => handleVote("down")}
                  disabled={!user || isVoting}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${!user || isVoting
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : userVote === "down"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                    }`}
                >
                  ▼ {comment.downvotes || 0}
                </button>

                <button
                  onClick={() => setIsReplyOpen(!isReplyOpen)}
                  disabled={!user}
                  className={`px-2 py-1 rounded font-medium ${!user
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                    }`}
                >
                  Reply
                </button>

                {replies.length > 0 && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-gray-600 hover:text-black font-medium px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    {showReplies
                      ? "▲ Hide replies"
                      : `▼ View ${replies.length} ${replies.length === 1 ? "reply" : "replies"
                      }`}
                  </button>
                )}
              </div>

              {isReplyOpen && (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="input-field resize-none text-sm"
                    rows="3"
                    placeholder={`Reply to @${author?.username || "user"}...`}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleReply}
                      className="btn-primary text-sm px-3 py-1.5"
                    >
                      Reply
                    </button>

                    <button
                      onClick={() => {
                        setIsReplyOpen(false);
                        setReplyContent("");
                      }}
                      className="btn-secondary text-sm px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showReplies && replies.length > 0 && (
          <div className="relative ml-6">

            {/* CONTINUOUS vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-300"></div>

            <div className="space-y-4 pl-6">
              {replies.map((reply) => (
                <div key={reply._id} className="relative">

                  {/* horizontal connector */}
                  <div className="absolute -left-6 top-6 w-6 h-[2px] bg-gray-300"></div>

                  <CommentThread
                    comment={reply}
                    postId={postId}
                    allComments={allComments}
                    onRefresh={onRefresh}
                    level={level + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div >
    </div>
  );
}

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const fetchComments = async (postId) => {
    const commentsData = await getCommentsByPostApi(postId);
    const fetchedComments = commentsData?.data || commentsData || [];

    const sortedComments = [...fetchedComments].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setAllComments(sortedComments);
  };

  const fetchPost = async () => {
    const postData = await getPostByIdApi(id);
    const fetchedPost = postData?.data || postData;
    setPost(fetchedPost);
    return fetchedPost;
  };

  const fetchPostVote = async (postId) => {
    if (!user) return;

    const voteData = await getVotesApi("post", postId);
    const votes = voteData?.data || [];

    const myVote = votes.find(
      (v) => String(v.user) === String(user._id || user.id)
    );

    if (myVote?.value === 1) setUserVote("up");
    else if (myVote?.value === -1) setUserVote("down");
    else setUserVote(null);
  };

  const refreshAll = async () => {
    const fetchedPost = await fetchPost();

    if (!fetchedPost) return;

    const postId = fetchedPost._id || fetchedPost.id;

    await fetchComments(postId);
    await fetchPostVote(postId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchedPost = await fetchPost();

        if (!fetchedPost) {
          navigate("/feed");
          return;
        }

        const postId = fetchedPost._id || fetchedPost.id;

        await fetchComments(postId);
        await fetchPostVote(postId);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleVote = async (voteType) => {
    if (!user || !post || isVoting) return;

    setIsVoting(true);

    try {
      const postId = post._id || post.id;

      await voteApi({
        targetType: "post",
        targetId: postId,
        value: voteType === "up" ? 1 : -1,
      });

      await refreshAll();
    } catch (err) {
      console.error("Error voting post:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("Please login to comment.");
      return;
    }

    if (!newComment.trim() || !post) return;

    try {
      const postId = post._id || post.id;

      await createCommentApi({
        postId,
        content: newComment,
        parentId: null,
      });

      setNewComment("");
      await refreshAll();
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(err.message || "Failed to create comment");
    }
  };


  const handleReportPost = async () => {
    if (!user) {
      alert("Login first");
      return;
    }

    if (!reportReason) {
      alert("Select report reason");
      return;
    }

    const id = post?._id || post?.id;

    if (!id) {
      alert("Post ID missing");
      return;
    }

    try {
      await createReportApi({
        targetType: "post",
        targetId: id,
        reason: reportReason,
        description: reportDetails,
      });

      alert("Report submitted");

      setReportOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (err) {
      console.log(err);
      alert(err.message || "Error submitting report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">{error || "Post not found"}</p>
        </div>
      </div>
    );
  }

  const postId = post._id || post.id;
  const author = post.author;

  const topLevelComments = allComments.filter((comment) => {
    return !comment.parentComment;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-white mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex gap-2 mb-4">
            {post.isAnnouncement && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                📢 Announcement
              </span>
            )}

            {post.isPinned && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                📌 Pinned
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 pb-6 border-b border-gray-300 mb-6">
            <div>
              <Link
                to={`/profile/${author?.username}`}
                className="text-black hover:text-gray-700 font-medium"
              >
                @{author?.username || "Anonymous"}
              </Link>

              <div className="text-xs text-gray-600">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="ml-auto">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                {author?.reputation || 0} rep
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={getTagLink(tag)}
                  className="badge-primary hover:shadow-md hover:border-gray-500 transition-all cursor-pointer inline-block"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className="flex gap-4 items-center">
            {!user && (
              <p className="text-sm text-gray-500">
                Login to upvote/downvote this post.
              </p>
            )}

            <button
              onClick={() => handleVote("up")}
              disabled={!user || isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${!user || isVoting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : userVote === "up"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:text-orange-600"
                }`}
            >
              ▲ {post.upvotes || 0} Upvotes
            </button>

            <button
              onClick={() => handleVote("down")}
              disabled={!user || isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${!user || isVoting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : userVote === "down"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-600 hover:text-blue-700"
                }`}
            >
              ▼ {post.downvotes || 0} Downvotes
            </button>
            <button
              onClick={() => setReportOpen(true)}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${!user
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
            >
              🚩 Report
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {topLevelComments.length} Comments
          </h2>

          <div className="card bg-white mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Add a comment
            </label>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-field resize-none mb-4"
              rows="4"
              placeholder="Share your thoughts..."
              disabled={!user}
            />

            <button
              onClick={handleAddComment}
              disabled={!user || !newComment.trim()}
              className={`btn-primary ${!user || !newComment.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
            >
              Post Comment
            </button>

            {!user && (
              <p className="text-xs text-gray-500 mt-2">
                Login to add comments.
              </p>
            )}
          </div>

          <div className="space-y-6">
            {topLevelComments.length > 0 ? (
              topLevelComments.map((comment) => (
                <CommentThread
                  key={comment._id || comment.id}
                  comment={comment}
                  postId={postId}
                  allComments={allComments}
                  onRefresh={refreshAll}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {reportOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Report Post
            </h2>

            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason
            </label>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input-field mb-4"
            >
              <option value="">Select reason</option>
              <option value="Hate speech">Hate speech</option>
              <option value="Spam content">Spam content</option>
              <option value="Misinformation">Misinformation</option>
              <option value="Harassment">Harassment</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Offensive Language">Offensive Language</option>
              <option value="Phishing">Phishing</option>
              <option value="Adult Content">Adult Content</option>
              <option value="Copyright Violation">Copyright Violation</option>
              <option value="Other">Other</option>
            </select>

            <label className="block text-sm font-medium text-gray-900 mb-2">
              Details
            </label>

            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="input-field resize-none mb-4"
              rows="4"
              placeholder="Explain the issue..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setReportOpen(false);
                  setReportReason("");
                  setReportDetails("");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleReportPost}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}