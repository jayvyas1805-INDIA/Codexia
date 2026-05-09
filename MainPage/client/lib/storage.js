// Initialize localStorage with default data structure
const STORAGE_KEYS = {
  USERS: 'codexia_users',
  POSTS: 'codexia_posts',
  COMMENTS: 'codexia_comments',
  COMMUNITIES: 'codexia_communities',
  VOTES: 'codexia_votes',
  PROBLEMS: 'codexia_problems',
  SUBMISSIONS: 'codexia_submissions',
  CHAT_MESSAGES: 'codexia_chat_messages',
  BEST_PRACTICE_PROBLEMS: 'codexia_best_practice_problems',
  BEST_PRACTICE_ATTEMPTS: 'codexia_best_practice_attempts',
};

// Initialize default data
function initializeData() {
  // Users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        id: 'user_1',
        username: 'admin',
        email: 'admin@codexia.dev',
        password: 'admin123',
        reputation: 5000,
        bio: 'Platform Administrator',
        role: 'admin',
        avatarColor: 'purple',
        profilePicture: null,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'user_2',
        username: 'moderator',
        email: 'moderator@codexia.dev',
        password: 'moderator123',
        reputation: 3500,
        bio: 'Community Moderator',
        role: 'moderator',
        avatarColor: 'blue',
        profilePicture: null,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'user_3',
        username: 'codewizard',
        email: 'codewizard@codexia.dev',
        password: 'password123',
        reputation: 2500,
        bio: 'Senior developer and tech enthusiast',
        role: 'user',
        avatarColor: 'gray',
        profilePicture: null,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Communities
  if (!localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) {
    const defaultCommunities = [
      {
        id: 'comm_1',
        name: 'JavaScript & React',
        description: 'Discuss JavaScript, React, and modern web development',
        icon: '⚛️',
        members: ['user_1', 'user_2', 'user_3'],
        createdAt: new Date(),
      },
      {
        id: 'comm_2',
        name: 'Python',
        description: 'Python programming discussions and best practices',
        icon: '🐍',
        members: ['user_1', 'user_2', 'user_3'],
        createdAt: new Date(),
      },
      {
        id: 'comm_3',
        name: 'Web Design',
        description: 'UI/UX and web design discussions',
        icon: '🎨',
        members: ['user_1', 'user_2', 'user_3'],
        createdAt: new Date(),
      },
      {
        id: 'comm_4',
        name: 'DevOps & Cloud',
        description: 'Cloud infrastructure and DevOps practices',
        icon: '☁️',
        members: ['user_1', 'user_2', 'user_3'],
        createdAt: new Date(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(defaultCommunities));
  }

  // Posts
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    const defaultPosts = [
      {
        id: 'post_1',
        title: 'Best practices for React hooks',
        content: 'I\'ve been using React hooks for a while now. Here are some best practices I\'ve discovered...',
        author: 'user_3',
        communityId: 'comm_1',
        upvotes: 156,
        downvotes: 5,
        comments: ['comment_1'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['React', 'JavaScript', 'Best Practices'],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(defaultPosts));
  }

  // Comments
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    const defaultComments = [
      {
        id: 'comment_1',
        postId: 'post_1',
        parentId: null,
        author: 'user_2',
        content: 'Great insights! I especially liked the part about custom hooks.',
        upvotes: 42,
        downvotes: 1,
        replies: [],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(defaultComments));
  }

  // Votes
  if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify({}));
  }

  // Problems
  if (!localStorage.getItem(STORAGE_KEYS.PROBLEMS)) {
    const defaultProblems = [
      {
        id: 'prob_1',
        title: 'Two Sum',
        description:
          'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
        difficulty: 'easy',
        category: 'Arrays',
        solution: 'Use a hash map to store values and their indices for O(n) time complexity.',
        createdAt: new Date(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(defaultProblems));
  }

  // Submissions
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify({}));
  }

  // Chat Messages
  if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify({}));
  }

  // Best Practice Problems
  if (!localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_PROBLEMS)) {
    const bestPracticeProblems = [
      {
        id: 'bp_1',
        title: 'Check if Two Numbers Sum to Target',
        description: 'Write a function that checks if any two numbers in an array add up to a target sum.',
        hint: 'Consider using a hash set or map to store values as you iterate through the array.',
        languages: {
          javascript: {
            template: 'function twoSum(arr, target) {\n  // Your code here\n}',
            testCases: [
              { input: 'twoSum([2, 7, 11, 15], 9)', expected: 'true', description: 'Returns true for [2,7] sum' },
              { input: 'twoSum([1, 2, 3], 10)', expected: 'false', description: 'Returns false when no pair exists' },
            ],
          },
          python: {
            template: 'def two_sum(arr, target):\n    # Your code here\n    pass',
            testCases: [
              { input: 'two_sum([2, 7, 11, 15], 9)', expected: 'True', description: 'Returns True for [2,7] sum' },
              { input: 'two_sum([1, 2, 3], 10)', expected: 'False', description: 'Returns False when no pair exists' },
            ],
          },
          java: {
            template: 'public boolean twoSum(int[] arr, int target) {\n    // Your code here\n}',
            testCases: [
              { input: 'twoSum([2, 7, 11, 15], 9)', expected: 'true', description: 'Returns true for [2,7] sum' },
              { input: 'twoSum([1, 2, 3], 10)', expected: 'false', description: 'Returns false when no pair exists' },
            ],
          },
          c: {
            template: 'bool twoSum(int arr[], int size, int target) {\n    // Your code here\n}',
            testCases: [
              { input: 'twoSum([2, 7, 11, 15], 4, 9)', expected: 'true', description: 'Returns true for [2,7] sum' },
              { input: 'twoSum([1, 2, 3], 3, 10)', expected: 'false', description: 'Returns false when no pair exists' },
            ],
          },
        },
        creditReward: 50,
        creditPenalty: -10,
        difficulty: 'easy',
      },
      {
        id: 'bp_2',
        title: 'Reverse a String Without Built-in Methods',
        description: 'Write a function to reverse a string without using built-in reverse methods.',
        hint: 'Use two pointers - one at the start and one at the end, swap and move towards center.',
        languages: {
          javascript: {
            template: 'function reverseString(str) {\n  // Your code here\n}',
            testCases: [
              { input: 'reverseString("hello")', expected: '"olleh"', description: 'Reverses hello to olleh' },
              { input: 'reverseString("abc")', expected: '"cba"', description: 'Reverses abc to cba' },
            ],
          },
          python: {
            template: 'def reverse_string(s):\n    # Your code here\n    pass',
            testCases: [
              { input: 'reverse_string("hello")', expected: '"olleh"', description: 'Reverses hello to olleh' },
              { input: 'reverse_string("abc")', expected: '"cba"', description: 'Reverses abc to cba' },
            ],
          },
          java: {
            template: 'public String reverseString(String s) {\n    // Your code here\n}',
            testCases: [
              { input: 'reverseString("hello")', expected: '"olleh"', description: 'Reverses hello to olleh' },
              { input: 'reverseString("abc")', expected: '"cba"', description: 'Reverses abc to cba' },
            ],
          },
          c: {
            template: 'void reverseString(char str[], int n) {\n    // Your code here\n}',
            testCases: [
              { input: 'reverseString("hello", 5)', expected: '"olleh"', description: 'Reverses hello to olleh' },
              { input: 'reverseString("abc", 3)', expected: '"cba"', description: 'Reverses abc to cba' },
            ],
          },
        },
        creditReward: 40,
        creditPenalty: -10,
        difficulty: 'easy',
      },
      {
        id: 'bp_3',
        title: 'Check if String is Palindrome',
        description: 'Write a function that checks if a string is a palindrome (ignoring spaces and case).',
        hint: 'Remove non-alphanumeric characters, convert to lowercase, and compare with reverse.',
        languages: {
          javascript: {
            template: 'function isPalindrome(str) {\n  // Your code here\n}',
            testCases: [
              { input: 'isPalindrome("A man a plan a canal Panama")', expected: 'true', description: 'Classic palindrome' },
              { input: 'isPalindrome("hello")', expected: 'false', description: 'Not a palindrome' },
            ],
          },
          python: {
            template: 'def is_palindrome(s):\n    # Your code here\n    pass',
            testCases: [
              { input: 'is_palindrome("A man a plan a canal Panama")', expected: 'True', description: 'Classic palindrome' },
              { input: 'is_palindrome("hello")', expected: 'False', description: 'Not a palindrome' },
            ],
          },
          java: {
            template: 'public boolean isPalindrome(String s) {\n    // Your code here\n}',
            testCases: [
              { input: 'isPalindrome("A man a plan a canal Panama")', expected: 'true', description: 'Classic palindrome' },
              { input: 'isPalindrome("hello")', expected: 'false', description: 'Not a palindrome' },
            ],
          },
          c: {
            template: 'bool isPalindrome(char str[]) {\n    // Your code here\n}',
            testCases: [
              { input: 'isPalindrome("A man a plan a canal Panama")', expected: 'true', description: 'Classic palindrome' },
              { input: 'isPalindrome("hello")', expected: 'false', description: 'Not a palindrome' },
            ],
          },
        },
        creditReward: 60,
        creditPenalty: -15,
        difficulty: 'medium',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BEST_PRACTICE_PROBLEMS, JSON.stringify(bestPracticeProblems));
  }

  // Best Practice Attempts
  if (!localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.BEST_PRACTICE_ATTEMPTS, JSON.stringify({}));
  }
}

// User operations
export const UserAPI = {
  register(username, email, password) {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    if (users.find((u) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password,
      reputation: 0,
      bio: '',
      role: 'user',
      avatarColor: 'gray',
      profilePicture: null,
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  login(email, password) {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return user;
  },

  getUser(userId) {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    return users.find((u) => u.id === userId);
  },

  getUserByUsername(username) {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    return users.find((u) => u.username === username);
  },

  getAllUsers() {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  },

  updateUser(userId, updates) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) throw new Error('User not found');

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[userIndex];
  },

  updateReputation(userId, points) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) throw new Error('User not found');

    users[userIndex].reputation += points;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[userIndex];
  },
};

// Post operations
export const PostAPI = {
  createPost(title, content, authorId, communityId, tags = []) {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];

    const newPost = {
      id: `post_${Date.now()}`,
      title,
      content,
      author: authorId,
      communityId,
      upvotes: 0,
      downvotes: 0,
      comments: [],
      tags,
      createdAt: new Date(),
    };

    posts.push(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  },

  getPost(postId) {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    return posts.find((p) => p.id === postId);
  },

  getAllPosts() {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
  },

  getPostsByCommunity(communityId) {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    return posts.filter((p) => p.communityId === communityId);
  },

  getPostsByAuthor(authorId) {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    return posts.filter((p) => p.author === authorId);
  },

  updatePost(postId, updates) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) throw new Error('Post not found');

    posts[postIndex] = { ...posts[postIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return posts[postIndex];
  },

  deletePost(postId) {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    const filtered = posts.filter((p) => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
  },
};

// Comment operations
export const CommentAPI = {
  createComment(postId, authorId, content, parentId = null) {
    initializeData();
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];

    const newComment = {
      id: `comment_${Date.now()}`,
      postId,
      parentId,
      author: authorId,
      content,
      upvotes: 0,
      downvotes: 0,
      replies: [],
      createdAt: new Date(),
    };

    comments.push(newComment);

    // Update parent comment's replies if it's a reply
    if (parentId) {
      const parentIndex = comments.findIndex((c) => c.id === parentId);
      if (parentIndex !== -1) {
        comments[parentIndex].replies.push(newComment.id);
      }
    }

    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    return newComment;
  },

  getComment(commentId) {
    initializeData();
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    return comments.find((c) => c.id === commentId);
  },

  getCommentsByPost(postId) {
    initializeData();
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    return comments.filter((c) => c.postId === postId && !c.parentId);
  },

  getReplies(parentId) {
    initializeData();
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    return comments.filter((c) => c.parentId === parentId);
  },

  updateComment(commentId, updates) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    const commentIndex = comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) throw new Error('Comment not found');

    comments[commentIndex] = { ...comments[commentIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    return comments[commentIndex];
  },

  deleteComment(commentId) {
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    const filtered = comments.filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(filtered));
  },
};

// Community operations
export const CommunityAPI = {
  createCommunity(name, description, icon) {
    initializeData();
    const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) || [];

    const newCommunity = {
      id: `comm_${Date.now()}`,
      name,
      description,
      icon,
      members: [],
      createdAt: new Date(),
    };

    communities.push(newCommunity);
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
    return newCommunity;
  },

  getCommunity(communityId) {
    initializeData();
    const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) || [];
    return communities.find((c) => c.id === communityId);
  },

  getAllCommunities() {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) || [];
  },

  joinCommunity(communityId, userId) {
    const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) || [];
    const commIndex = communities.findIndex((c) => c.id === communityId);

    if (commIndex === -1) throw new Error('Community not found');

    if (!communities[commIndex].members.includes(userId)) {
      communities[commIndex].members.push(userId);
      localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
    }

    return communities[commIndex];
  },

  leaveCommunity(communityId, userId) {
    const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES)) || [];
    const commIndex = communities.findIndex((c) => c.id === communityId);

    if (commIndex === -1) throw new Error('Community not found');

    communities[commIndex].members = communities[commIndex].members.filter((id) => id !== userId);
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));

    return communities[commIndex];
  },
};

// Vote operations
export const VoteAPI = {
  voteOnPost(postId, userId, voteType) {
    initializeData();
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES)) || {};
    const voteKey = `post_${postId}_${userId}`;

    const currentVote = votes[voteKey];
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    const post = posts.find((p) => p.id === postId);

    if (!post) throw new Error('Post not found');

    // Remove previous vote
    if (currentVote === 'up') {
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else if (currentVote === 'down') {
      post.downvotes = Math.max(0, post.downvotes - 1);
    }

    // Add new vote
    if (voteType === 'up') {
      post.upvotes += 1;
    } else if (voteType === 'down') {
      post.downvotes += 1;
    }

    votes[voteKey] = voteType || null;
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    return post;
  },

  voteOnComment(commentId, userId, voteType) {
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES)) || {};
    const voteKey = `comment_${commentId}_${userId}`;

    const currentVote = votes[voteKey];
    const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS)) || [];
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) throw new Error('Comment not found');

    // Remove previous vote
    if (currentVote === 'up') {
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else if (currentVote === 'down') {
      comment.downvotes = Math.max(0, comment.downvotes - 1);
    }

    // Add new vote
    if (voteType === 'up') {
      comment.upvotes += 1;
    } else if (voteType === 'down') {
      comment.downvotes += 1;
    }

    votes[voteKey] = voteType || null;
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    return comment;
  },

  getUserVote(id, userId, type = 'post') {
    const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES)) || {};
    const voteKey = `${type}_${id}_${userId}`;
    return votes[voteKey] || null;
  },
};

// Problem operations
export const ProblemAPI = {
  createProblem(title, description, difficulty, category, solution) {
    initializeData();
    const problems = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROBLEMS)) || [];

    const newProblem = {
      id: `prob_${Date.now()}`,
      title,
      description,
      difficulty,
      category,
      solution,
      createdAt: new Date(),
    };

    problems.push(newProblem);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    return newProblem;
  },

  getProblem(problemId) {
    initializeData();
    const problems = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROBLEMS)) || [];
    return problems.find((p) => p.id === problemId);
  },

  getAllProblems() {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROBLEMS)) || [];
  },
};

// Submission operations
export const SubmissionAPI = {
  createSubmission(problemId, userId, code, result) {
    initializeData();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || {};

    if (!submissions[problemId]) {
      submissions[problemId] = [];
    }

    const newSubmission = {
      id: `sub_${Date.now()}`,
      problemId,
      userId,
      code,
      result,
      createdAt: new Date(),
    };

    submissions[problemId].push(newSubmission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    return newSubmission;
  },

  getSubmissions(problemId, userId) {
    initializeData();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || {};
    return (submissions[problemId] || []).filter((s) => s.userId === userId);
  },

  getAllSubmissions(problemId) {
    initializeData();
    const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || {};
    return submissions[problemId] || [];
  },
};

// Chat operations
export const ChatAPI = {
  sendMessage(communityId, userId, message) {
    initializeData();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || {};

    if (!messages[communityId]) {
      messages[communityId] = [];
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      communityId,
      userId,
      message,
      createdAt: new Date(),
    };

    messages[communityId].push(newMessage);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    return newMessage;
  },

  getMessages(communityId) {
    initializeData();
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) || {};
    return messages[communityId] || [];
  },
};

// Best Practice operations
export const BestPracticeAPI = {
  getAllProblems() {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_PROBLEMS)) || [];
  },

  getProblem(problemId) {
    initializeData();
    const problems = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_PROBLEMS)) || [];
    return problems.find((p) => p.id === problemId);
  },

  submitAttempt(problemId, userId, language, code, isCorrect) {
    initializeData();
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_ATTEMPTS)) || {};

    if (!attempts[userId]) {
      attempts[userId] = [];
    }

    const attempt = {
      id: `attempt_${Date.now()}`,
      problemId,
      userId,
      language,
      code,
      isCorrect,
      createdAt: new Date(),
    };

    attempts[userId].push(attempt);
    localStorage.setItem(STORAGE_KEYS.BEST_PRACTICE_ATTEMPTS, JSON.stringify(attempts));

    // Update user reputation
    if (isCorrect) {
      const problem = this.getProblem(problemId);
      UserAPI.updateReputation(userId, problem?.creditReward || 50);
    } else {
      const problem = this.getProblem(problemId);
      UserAPI.updateReputation(userId, problem?.creditPenalty || -10);
    }

    return attempt;
  },

  getUserAttempts(userId) {
    initializeData();
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_PRACTICE_ATTEMPTS)) || {};
    return attempts[userId] || [];
  },

  hasUserSolvedProblem(userId, problemId) {
    const attempts = this.getUserAttempts(userId);
    return attempts.some((a) => a.problemId === problemId && a.isCorrect);
  },

  getUserStats(userId) {
    const attempts = this.getUserAttempts(userId);
    const solved = attempts.filter((a) => a.isCorrect).length;
    const attempted = new Set(attempts.map((a) => a.problemId)).size;
    return {
      solved,
      attempted,
      accuracy: attempted > 0 ? Math.round((solved / attempted) * 100) : 0,
    };
  },
};

// Initialize on module load
initializeData();
