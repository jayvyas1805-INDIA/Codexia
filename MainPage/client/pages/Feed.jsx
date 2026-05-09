import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Modal from '../components/Modal';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import {
  getPostsApi,
  createPostApi,
  getCommunitiesApi,
  createCommunityApi,
  getProblemsApi,
  getTopUsersApi,
} from '../apis/api';
import '../styles/Feed.css';

function CommunitiesSidebar({
  communities,
  selectedCommunityId,
  onSelectCommunity,
  onCreateCommunity,
}) {
  return (
    <div className="card bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Communities</h3>

        <button
          onClick={onCreateCommunity}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
          title="Create Community"
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onSelectCommunity(null)}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedCommunityId === null
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-200'
            }`}
        >
          All Posts
        </button>

        {communities.map((comm) => (
          <Link key={comm._id} to={`/community/${comm._id}`} className="block">
            <div
              className={`w-full text-left px-3 py-2 rounded transition-colors truncate ${selectedCommunityId === comm._id
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-200'
                }`}
              title={comm.name}
            >
              {comm.icon || '👥'} {comm.name?.substring(0, 20)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrendingProblems({ problems = [] }) {
  return (
    <div className="card bg-white">
      <h3 className="font-bold text-gray-900 mb-4">Trending Problems</h3>

      <div className="space-y-2">
        {problems.slice(0, 5).map((problem) => (
          <Link
            key={problem._id}
            to={`/problem/${problem._id}`}
            className="block p-2 rounded hover:bg-gray-200 transition-colors group"
          >
            <div className="text-sm text-gray-700 group-hover:text-black truncate font-medium">
              {problem.title}
            </div>

            <div className="text-xs text-gray-500">
              <span
                className={`inline-block px-2 py-0.5 rounded ${problem.difficulty === 'easy'
                  ? 'bg-green-900 text-green-300'
                  : problem.difficulty === 'medium'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-red-900 text-red-300'
                  }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TopContributors({ users = [] }) {
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id || user?.id;

  const uniqueUsers = Array.from(
    new Map(
      users
        .filter(Boolean)
        .filter((u) => u.username)
        .map((u) => [String(u._id || u.id), u])
    ).values()
  );

  const contributors = uniqueUsers
    .filter((u) => String(u._id || u.id))
    .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
    .slice(0, 5);

  return (
    <div className="card bg-white">
      <h3 className="font-bold text-gray-900 mb-4">Top Contributors</h3>

      <div className="space-y-2">
        {contributors.length > 0 ? (
          contributors.map((contributor) => (
            <Link
              key={contributor._id || contributor.id}
              to={`/profile/${contributor.username}`}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-200 transition-colors group"
            >
              <span className="text-sm text-gray-700 group-hover:text-black truncate">
                @{contributor.username}
              </span>

              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                {contributor.reputation || 0}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">No contributors yet</p>
        )}
      </div>
    </div>
  );
}

export default function Feed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');

  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [creatingCommunity, setCreatingCommunity] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [postsData, communitiesData, problemsData] = await Promise.all([
          getPostsApi(),
          getCommunitiesApi(),
          getProblemsApi(),
        ]);

        const fetchedPosts = postsData?.data || postsData || [];
        const fetchedCommunities = communitiesData?.data || communitiesData || [];
        const fetchedProblems = problemsData?.data || problemsData || [];

        setPosts(fetchedPosts);
        setCommunities(fetchedCommunities);
        setProblems(fetchedProblems);

        const topUsersData = await getTopUsersApi();
        setUsers(topUsersData?.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCommunityId
    ? posts.filter((p) => {
      const cid = p.community?._id || p.community || p.communityId;
      return String(cid) === String(selectedCommunityId);
    })
    : posts;

  const handleCreatePost = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setPosting(true);

      const tags = postTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const postData = {
        title: postTitle,
        content: postContent,
        community: selectedCommunityId,
        tags,
      };

      const response = await createPostApi(postData);
      const newPost = response.data || response;

      setPosts([newPost, ...posts]);

      if (newPost.author && newPost.author.username) {
        setUsers((prev) => {
          const map = new Map(
            prev.map((u) => [String(u._id || u.id), u])
          );
          map.set(String(newPost.author._id || newPost.author.id), newPost.author);
          return Array.from(map.values());
        });
      }

      setPostTitle('');
      setPostContent('');
      setPostTags('');
      setIsCreatePostOpen(false);
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleCreateCommunity = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!communityName.trim()) {
      alert('Name required');
      return;
    }

    try {
      setCreatingCommunity(true);

      const res = await createCommunityApi({
        name: communityName,
        description: communityDesc,
        isPrivate,
      });

      const newCommunity = res.data;

      setCommunities([newCommunity, ...communities]);

      setCommunityName('');
      setCommunityDesc('');
      setIsPrivate(false);
      setIsCreateCommunityOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create community');
    } finally {
      setCreatingCommunity(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <CommunitiesSidebar
            communities={communities}
            selectedCommunityId={selectedCommunityId}
            onSelectCommunity={setSelectedCommunityId}
            onCreateCommunity={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              setIsCreateCommunityOpen(true);
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-white mb-6">
            <div className="flex items-center gap-3">
              <Link
                to={user ? `/profile/${user.username}` : '/login'}
                className="flex-shrink-0"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow ${user?.avatarColor === 'purple'
                      ? 'bg-gradient-to-br from-purple-400 to-purple-700'
                      : user?.avatarColor === 'blue'
                        ? 'bg-gradient-to-br from-blue-400 to-blue-700'
                        : user?.avatarColor === 'red'
                          ? 'bg-gradient-to-br from-red-400 to-red-700'
                          : user?.avatarColor === 'green'
                            ? 'bg-gradient-to-br from-green-400 to-green-700'
                            : 'bg-gradient-to-br from-gray-300 to-gray-600'
                      }`}
                  >
                    <span className="text-lg font-bold text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'G'}
                    </span>
                  </div>
                )}
              </Link>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  setIsCreatePostOpen(true);
                }}
                className="flex-1 text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-700"
              >
                Share your thoughts, code, or question...
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  author={post.author}
                  onVote={(updated) => {
                    setPosts(
                      posts.map((p) =>
                        p._id === updated._id ? updated : p
                      )
                    );
                  }}
                />
              ))
            ) : (
              <div className="text-center py-12 card bg-white">
                <p className="text-gray-600">
                  No posts yet. Be the first to post!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block space-y-6">
          <TopContributors users={users} />
          <TrendingProblems problems={problems} />
        </div>
      </div>

      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="input-field"
              placeholder="What's your question or topic?"
              maxLength={100}
            />
            <p className="text-xs text-gray-600 mt-1">
              {postTitle.length}/100
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="input-field resize-none"
              rows="8"
              placeholder="Share your thoughts, code, or question..."
            />
            <p className="text-xs text-gray-600 mt-1">
              {postContent.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              className="input-field"
              placeholder="JavaScript, React, TypeScript"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleCreatePost}
              disabled={posting || !postTitle.trim() || !postContent.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        title="Create Community"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="input-field"
              placeholder="Enter community name"
            />
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea
              value={communityDesc}
              onChange={(e) => setCommunityDesc(e.target.value)}
              className="input-field"
              rows="3"
              placeholder="Describe your community"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Visibility</span>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative w-16 h-7 rounded-full transition ${isPrivate ? 'bg-black' : 'bg-gray-300'
                }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isPrivate ? 'left-[38px]' : 'left-1'
                  }`}
              />

              <span
                className={`absolute inset-0 flex items-center text-[10px] font-semibold ${isPrivate
                  ? 'justify-start pl-2 text-white'
                  : 'justify-end pr-2 text-gray-800'
                  }`}
              >
                {isPrivate ? 'Private' : 'Public'}
              </span>
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreateCommunityOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleCreateCommunity}
              disabled={creatingCommunity || !communityName.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingCommunity ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}