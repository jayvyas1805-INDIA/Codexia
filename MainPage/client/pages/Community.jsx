import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Modal from "../components/Modal";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import {
  getCommunityByIdApi,
  joinCommunityApi,
  leaveCommunityApi,
  createPostApi,
  getPostsByCommunityApi,
} from "../apis/api";
import "../styles/Community.css";

export default function Community() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const [loading, setLoading] = useState(true);

  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);

        const communityRes = await getCommunityByIdApi(id);
        const fetchedCommunity = communityRes.data;

        setCommunity(fetchedCommunity);

        const postsRes = await getPostsByCommunityApi(id);
        setPosts(postsRes.data || []);

        const members = fetchedCommunity.members || [];

        const joined = members.some((member) => {
          const memberId = member?._id || member;
          return String(memberId) === String(userId);
        });

        setIsMember(joined);
      } catch (error) {
        alert(error.message || "Failed to fetch community");
        navigate("/feed");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, userId, navigate]);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await joinCommunityApi(id);
      setIsMember(true);

      setCommunity((prev) => ({
        ...prev,
        members: [...(prev.members || []), user],
        membersCount: (prev.membersCount || prev.members?.length || 0) + 1,
      }));
    } catch (error) {
      alert(error.message || "Failed to join community");
    }
  };

  const handleLeave = async () => {
    if (!user) return;

    try {
      await leaveCommunityApi(id);
      setIsMember(false);

      setCommunity((prev) => ({
        ...prev,
        members: (prev.members || []).filter((member) => {
          const memberId = member?._id || member;
          return String(memberId) !== String(userId);
        }),
        membersCount: Math.max(
          0,
          (prev.membersCount || prev.members?.length || 1) - 1
        ),
      }));
    } catch (error) {
      alert(error.message || "Failed to leave community");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      _id: Date.now().toString(),
      userId,
      user,
      message: newMessage,
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const postData = {
        title: postTitle,
        content: postContent,
        community: id,
        tags: [],
      };

      const res = await createPostApi(postData);
      const newPost = res.data;

      setPosts([newPost, ...posts]);
      setPostTitle("");
      setPostContent("");
      setIsPostModalOpen(false);
    } catch (error) {
      alert(error.message || "Failed to create post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Community not found</p>
        </div>
      </div>
    );
  }

  const memberCount = community.membersCount || community.members?.length || 0;

  const pinnedAnnouncements = posts.filter(
    (post) => post.isAnnouncement && post.isPinned
  );

  const normalPosts = posts.filter(
    (post) => !(post.isAnnouncement && post.isPinned)
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-white border border-gray-300 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{community.icon || "👥"}</div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {community.name}
                </h1>
                <p className="text-gray-600">{community.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600 text-right">
                {memberCount} members
              </div>

              {isMember ? (
                <button onClick={handleLeave} className="btn-secondary">
                  Leave
                </button>
              ) : (
                <button onClick={handleJoin} className="btn-primary">
                  Join
                </button>
              )}
            </div>
          </div>
        </div>

        {pinnedAnnouncements.length > 0 && (
          <div className="mb-6 space-y-3">
            {pinnedAnnouncements.map((post) => (
              <div
                key={post._id}
                className="card bg-yellow-50 border border-yellow-300"
              >
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                    📌 Pinned
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    📢 Announcement
                  </span>
                </div>

                <PostCard
                  post={post}
                  author={post.author}
                  readOnly={!user}
                  onVote={(updated) => {
                    setPosts(
                      posts.map((p) => (p._id === updated._id ? updated : p))
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!user && (
              <div className="mb-4 p-4 rounded border border-yellow-300 bg-yellow-50 text-yellow-900">
                You are viewing as a guest. Posts are visible, but
                posting/commenting/upvoting/downvoting requires login.
              </div>
            )}

            {user && !isMember && (
              <div className="mb-4 p-4 rounded border border-blue-300 bg-blue-50 text-blue-900">
                Join this community to post and participate.
              </div>
            )}

            <div className="card bg-white mb-6">
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }

                  if (!isMember) {
                    alert("Join the community to create posts.");
                    return;
                  }

                  setIsPostModalOpen(true);
                }}
                className={`w-full text-left px-4 py-3 rounded transition-colors ${
                  !user || !isMember
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700"
                }`}
                disabled={!user || !isMember}
              >
                Share something with {community.name}...
              </button>
            </div>

            <div className="space-y-4">
              {normalPosts.length > 0 ? (
                normalPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    author={post.author}
                    readOnly={!user}
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
                    No posts yet in {community.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card bg-white flex flex-col h-96">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
                <h3 className="font-bold text-gray-900">Chat</h3>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showChat ? "−" : "+"}
                </button>
              </div>

              {showChat && (
                <>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {chatMessages.length > 0 ? (
                      chatMessages.map((msg) => (
                        <div key={msg._id} className="text-xs">
                          <div className="text-black font-medium">
                            @{msg.user?.username || user?.username}
                          </div>
                          <div className="text-gray-700">{msg.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-600 text-xs py-4">
                        No messages yet
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      className="input-field text-sm"
                      placeholder="Message..."
                      disabled={!user}
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!user}
                      className={`px-3 py-2 rounded transition-all ${
                        !user
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-900"
                      }`}
                    >
                      Send
                    </button>
                  </div>

                  {!user && (
                    <p className="text-xs text-gray-500 mt-2">
                      Login to join the chat and post messages.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title={`Create Post in ${community?.name}`}
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
              placeholder="Post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="input-field resize-none"
              rows="6"
              placeholder="Post content..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button onClick={handleCreatePost} className="btn-primary">
              Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}