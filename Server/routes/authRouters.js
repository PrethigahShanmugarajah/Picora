// Server / routes / authRouters.js
import express from "express";
import { registerUser } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

export default authRouter;
