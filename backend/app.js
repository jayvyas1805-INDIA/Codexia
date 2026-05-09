import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import communitiesRoutes from "./routes/communities.routes.js";
import chatsRoutes from "./routes/chats.routes.js";
import problemsRoutes from "./routes/problems.routes.js";
import submissionsRoutes from "./routes/submissions.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import votesRoutes from "./routes/votes.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import bestPracticeRoutes from "./routes/bestpractice.routes.js";
import attemptsRoutes from "./routes/attempts.routes.js";
import moderatorRoutes from "./routes/moderator.routes.js";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5172",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true
  })
);
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }
  next(err);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/communities", communitiesRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/bestpractice", bestPracticeRoutes);
app.use("/api/attempts", attemptsRoutes);
app.use("/api/moderator", moderatorRoutes);

app.get("/", (req, res) => {
  res.send("Codexia API running");
});

export default app;