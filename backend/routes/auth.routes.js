import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  getUserByUsername,
  getTopUsers
} from "../controllers/AuthController.js";
import protect from "../middlewares/AuthMiddle.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/profile/:username", getUserByUsername);
router.get("/top-users", getTopUsers);

export default router;