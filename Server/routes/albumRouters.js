// Server / routes / albumRouters.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addPhotosToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getMyAlbums,
} from "../controllers/albumControllers.js";

const albumRouter = express.Router();

albumRouter.post("/", requireAuth, createAlbum);
albumRouter.get("/", requireAuth, getMyAlbums);
albumRouter.get("/:id", requireAuth, getAlbumById);
albumRouter.delete("/:id", requireAuth, deleteAlbum);
albumRouter.post("/:id/photos", requireAuth, addPhotosToAlbum);

export default albumRouter;
