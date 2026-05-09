import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { voteApi, getVotesApi } from '../apis/api';
import { getTagLink } from '../lib/tagUtils';

export default function PostCard({ post, onVote, author, readOnly = false }) {
  const { user } = useContext(AuthContext);

  const postId = post._id || post.id;
  const community = post.community;
  const communityId = community?._id || community;
  const communityName = community?.name;
  const communityIcon = community?.icon || '👥';
  const currentUserId = user?._id || user?.id;

  const [userVote, setUserVote] = useState(null);
  const [voteCount, setVoteCount] = useState(post.voteCount || 0);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchVote = async () => {
      if (!user || readOnly || !postId) return;

      try {
        const voteData = await getVotesApi('post', postId);

        if (voteData?.data) {
          const userVoteObj = voteData.data.find(
            (v) => String(v.user) === String(currentUserId)
          );

          setUserVote(userVoteObj?.value || null);
        }
      } catch (err) {
        console.error('Error fetching vote:', err);
      }
    };

    fetchVote();
  }, [user, postId, currentUserId, readOnly]);

  const handleVote = async (value) => {
    if (!user || readOnly || isVoting) return;

    setIsVoting(true);

    try {
      await voteApi({
        targetType: 'post',
        targetId: postId,
        value,
      });

      let newUserVote = value;

      if (userVote === value) {
        newUserVote = null;
      }

      let countChange = 0;

      if (userVote === null && newUserVote === 1) countChange = 1;
      if (userVote === null && newUserVote === -1) countChange = -1;

      if (userVote === 1 && newUserVote === null) countChange = -1;
      if (userVote === -1 && newUserVote === null) countChange = 1;

      if (userVote === 1 && newUserVote === -1) countChange = -2;
      if (userVote === -1 && newUserVote === 1) countChange = 2;

      const newVoteCount = voteCount + countChange;

      const updatedPost = {
        ...post,
        voteCount: newVoteCount,
      };

      setUserVote(newUserVote);
      setVoteCount(newVoteCount);

      onVote?.(updatedPost);
    } catch (err) {
      console.error('Error voting:', err);
      alert(err.message || 'Vote failed');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="card-hover cursor-pointer transition-all">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={() => handleVote(1)}
            disabled={!user || readOnly || isVoting}
            className={`px-2 py-1 rounded transition-colors ${!user || readOnly
              ? 'text-gray-300 cursor-not-allowed'
              : userVote === 1
                ? 'text-orange-600 bg-gray-200'
                : 'text-gray-500 hover:text-orange-600'
              }`}
          >
            ▲
          </button>

          <span className="text-sm font-medium text-gray-700 min-w-8 text-center">
            {voteCount}
          </span>

          <button
            onClick={() => handleVote(-1)}
            disabled={!user || readOnly || isVoting}
            className={`px-2 py-1 rounded transition-colors ${!user || readOnly
              ? 'text-gray-300 cursor-not-allowed'
              : userVote === -1
                ? 'text-blue-700 bg-gray-200'
                : 'text-gray-500 hover:text-blue-700'
              }`}
          >
            ▼
          </button>
        </div>
        <div className="flex-1 min-w-0">
        {communityName && (
          <Link
            to={`/community/${communityId}`}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black mb-1"
          >
            <span>{communityIcon}</span>
            <span>{communityName}</span>
          </Link>
        )}
          <Link to={`/post/${postId}`} className="block hover:underline mb-2">
            <h3 className="text-lg font-semibold text-gray-900 break-words">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.content}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              {author?.profilePicture ? (
                <img
                  src={author.profilePicture}
                  alt={author.username}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm ${author?.avatarColor === 'purple'
                    ? 'bg-purple-500'
                    : author?.avatarColor === 'blue'
                      ? 'bg-blue-500'
                      : author?.avatarColor === 'red'
                        ? 'bg-red-500'
                        : author?.avatarColor === 'green'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                    }`}
                >
                  {author?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}

              <div className="leading-snug">
                <Link
                  to={`/profile/${author?.username}`}
                  className="text-black hover:text-gray-700 font-semibold"
                >
                  {author?.username || 'Anonymous'}
                </Link>
                <div className="text-[10px] text-gray-500">
                  {author?.reputation || 0} rep
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ''}
              </span>
              <div className="flex items-center gap-1">
                <Link to={`/post/${postId}`} className="flex items-center gap-1 hover:text-black">
                  <span>💬</span>
                  <span>{post.commentCount || post.comments?.length || 0}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}