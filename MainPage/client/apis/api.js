import axios from "axios";

// Base URL from env
const BASE_URL = import.meta.env.VITE_base_url || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Helper to get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper to make auth headers
const authHeader = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

/*
|--------------------------------------------------------------------------
| AUTH APIs
|--------------------------------------------------------------------------
*/

// Register user
export const registerUserApi = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const loginUserApi = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Get current logged-in user
export const getMeApi = async () => {
  try {
    const response = await api.get("/auth/me", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching profile failed" };
  }
};
export const getUserByUsernameApi = async (username) => {
  try {
    const response = await api.get(`/auth/profile/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching user failed" };
  }
};

export const getTopUsersApi = async () => {
  try {
    const response = await api.get("/auth/top-users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching top users failed" };
  }
};

// Logout helper (frontend only)
export const logoutUserApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Save auth data helper
export const saveAuthData = (data) => {
  if (data?.data?.token) {
    localStorage.setItem("token", data.data.token);
  }

  if (data?.data?.user) {
    localStorage.setItem("user", JSON.stringify(data.data.user));
  }
};

// Get stored user helper
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


export const getPostsByCommunityApi = async (communityId) => {
  try {
    const response = await api.get(`/posts/community/${communityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching community posts failed" };
  }
};

/*
|--------------------------------------------------------------------------
| POST APIs
|--------------------------------------------------------------------------
*/

// Get all posts
export const getPostsApi = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching posts failed" };
  }
};

// Get post by ID
export const getPostByIdApi = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching post failed" };
  }
};

export const getPostsByUserApi = async (userId) => {
  try {
    const res = await api.get(`/posts?author=${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch user posts" };
  }
};

// Create new post
export const createPostApi = async (postData) => {
  try {
    const response = await api.post("/posts", postData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Creating post failed" };
  }
};

// Update post
export const updatePostApi = async (postId, postData) => {
  try {
    const response = await api.put(`/posts/${postId}`, postData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Updating post failed" };
  }
};

// Delete post
export const deletePostApi = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Deleting post failed" };
  }
};

// Increment post views
export const incrementPostViewsApi = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/views`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Incrementing views failed" };
  }
};

/*
|--------------------------------------------------------------------------
| COMMUNITY APIs
|--------------------------------------------------------------------------
*/

// Get all communities
export const getCommunitiesApi = async () => {
  try {
    const response = await api.get("/communities");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching communities failed" };
  }
};

// Get community by ID
export const getCommunityByIdApi = async (communityId) => {
  try {
    const response = await api.get(`/communities/${communityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching community failed" };
  }
};

// Join community
export const joinCommunityApi = async (communityId) => {
  try {
    const response = await api.post(`/communities/${communityId}/join`, {}, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Joining community failed" };
  }
};

// Leave community
export const leaveCommunityApi = async (communityId) => {
  try {
    const response = await api.post(`/communities/${communityId}/leave`, {}, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Leaving community failed" };
  }
};

// Create community
export const createCommunityApi = async (communityData) => {
  try {
    const response = await api.post("/communities", communityData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Creating community failed" };
  }
};

/*
|--------------------------------------------------------------------------
| USER APIs
|--------------------------------------------------------------------------
*/

// Get all users (requires MODERATOR/ADMIN)
export const getUsersApi = async () => {
  try {
    const response = await api.get("/users", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching users failed" };
  }
};

/// Get user by username (public)
// export const getUserByUsernameApi = async (username) => {
//   try {
//     const response = await api.get(`/users/by-username/${username}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Fetching user failed" };
//   }
// };

// Get user by ID
export const getUserByIdApi = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching user failed" };
  }
};

// Update profile
export const updateProfileApi = async (userData) => {
  try {
    const response = await api.put("/users/me", userData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Updating profile failed" };
  }
};

// Change password
export const changePasswordApi = async (passwordData) => {
  try {
    const response = await api.post("/users/change-password", passwordData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Changing password failed" };
  }
};

/*
|--------------------------------------------------------------------------
| PROBLEM APIs
|--------------------------------------------------------------------------
*/

// Get all problems
export const getProblemsApi = async () => {
  try {
    const response = await api.get("/problems");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching problems failed" };
  }
};

// Get problem by ID
export const getProblemByIdApi = async (problemId) => {
  try {
    const response = await api.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching problem failed" };
  }
};

// Create problem (ADMIN/MODERATOR only)
export const createProblemApi = async (problemData) => {
  try {
    const response = await api.post("/problems", problemData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Creating problem failed" };
  }
};

// Update problem (ADMIN/MODERATOR only)
export const updateProblemApi = async (problemId, problemData) => {
  try {
    const response = await api.put(`/problems/${problemId}`, problemData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Updating problem failed" };
  }
};

// Delete problem (ADMIN/MODERATOR only)
export const deleteProblemApi = async (problemId) => {
  try {
    const response = await api.delete(`/problems/${problemId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Deleting problem failed" };
  }
};

/*
|--------------------------------------------------------------------------
| VOTE APIs
|--------------------------------------------------------------------------
*/

// Create or update vote
export const voteApi = async (voteData) => {
  try {
    const response = await api.post("/votes", voteData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Voting failed" };
  }
};

// Get votes for a target (post/comment)
export const getVotesApi = async (targetType, targetId) => {
  try {
    const response = await api.get(`/votes/${targetType}/${targetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching votes failed" };
  }
};

/*
|--------------------------------------------------------------------------
| COMMENT APIs
|--------------------------------------------------------------------------
*/

// Get comments by post ID
export const getCommentsByPostApi = async (postId) => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching comments failed" };
  }
};

// Create comment
export const createCommentApi = async (commentData) => {
  try {
    const response = await api.post("/comments", commentData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Creating comment failed" };
  }
};

// Update comment
export const updateCommentApi = async (commentId, commentData) => {
  try {
    const response = await api.put(`/comments/${commentId}`, commentData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Updating comment failed" };
  }
};

// Delete comment
export const deleteCommentApi = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Deleting comment failed" };
  }
};

/*
|--------------------------------------------------------------------------
| SUBMISSION APIs
|--------------------------------------------------------------------------
*/

// Create submission
export const createSubmissionApi = async (submissionData) => {
  try {
    const response = await api.post("/submissions", submissionData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Creating submission failed" };
  }
};

// Get submissions by user
export const getSubmissionsByUserApi = async (userId) => {
  try {
    const response = await api.get(`/submissions/user/${userId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching submissions failed" };
  }
};

// Get submissions by problem
export const getSubmissionsByProblemApi = async (problemId) => {
  try {
    const response = await api.get(`/submissions/problem/${problemId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetching submissions failed" };
  }
};

export const updateSubmissionApi = async (submissionId, data) => {
  const res = await api.put(`/submissions/${submissionId}`, data);
  return res.data;
};


export const createReportApi = async (reportData) => {
  try {
    const response = await api.post("/reports", reportData, {
      headers: authHeader(),
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Creating report failed",
    };
  }

};

// Export axios instance in case needed elsewhere
export default api;



