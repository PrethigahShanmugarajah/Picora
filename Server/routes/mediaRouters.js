// Server / routes / mediaRouters.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  emptyTrash,
  getMedia,
  getStorageStats,
  getTrash,
  uploadMedia,
} from "../controllers/mediaControllers.js";

const mediaRouter = express.Router();

mediaRouter.post(
  "/upload",
  requireAuth,
  upload.array("media", 20),
  uploadMedia,
);

mediaRouter.get("/", requireAuth, getMedia);

mediaRouter.get("/trash", requireAuth, getTrash);

mediaRouter.delete("/trash/empty", requireAuth, emptyTrash);

mediaRouter.get("/stats", requireAuth, getStorageStats);

export default mediaRouter;
