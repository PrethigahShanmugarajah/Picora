// Server / routes / albumRouters.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createAlbum, getMyAlbums } from "../controllers/albumControllers.js";

const albumRouter = express.Router();

albumRouter.post("/", requireAuth, createAlbum);
albumRouter.get("/", requireAuth, getMyAlbums);

export default albumRouter;
