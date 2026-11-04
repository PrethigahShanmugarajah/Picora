// Server / routes / authRouters.js
import express from "express";
import {
  getMe,
  loginUser,
  registerUser,
} from "../controllers/authControllers.js";
import { requireAuth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", requireAuth, getMe);

export default authRouter;
