// Server / routes / albumRouters.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createAlbum } from "../controllers/albumControllers.js";

const albumRouter = express.Router();

albumRouter.post("/", requireAuth, createAlbum);

export default albumRouter;
