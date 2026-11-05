// Server / controllers / mediaControllers.js
import { imagekit, toFile } from "../config/imageKit.js";
import { imagekitUrlEndpoint } from "../config/env.js";
import Media from "../models/Media.js";
import Album from "../models/Album.js";
import mongoose from "mongoose";

/* -------- Upload Media -------- */
export const uploadMedia = async (req, res) => {
  try {
    const files = req.files;

    if (!files) {
      return res.status(400).json({
        success: false,
        message: "No files were provided.",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The uploaded files list is empty.",
      });
    }

    const uploadedMedia = [];

    for (const file of files) {
      const isVideo = file.mimetype.startsWith("video/");
      const mediaType = isVideo ? "video" : "image";
      const fileObj = await toFile(file.buffer, file.originalname, {
        type: file.mimetype,
      });

      const uploadParams = {
        file: fileObj,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: isVideo ? "/my-videos" : "/my-photos",
        useUniqueFileName: true,
        responseFields: ["tags"],
      };

      if (!isVideo) {
        uploadParams.extensions = [
          {
            name: "google-auto-tagging",
            minConfidence: 60,
            maxTags: 10,
          },
        ];
      }

      const ikRes = await imagekit.files.upload(uploadParams);

      const title = file.originalname;
      const endpoint = imagekitUrlEndpoint;
      const imagePath = ikRes.filePath.replace(/^\/+/, "");
      const transformation = "tr:w-400";
      const thumbnailUrl = isVideo
        ? `${endpoint}/${transformation}/${imagePath}/ik-thumbnail.jpg`
        : `${endpoint}/${transformation}/${imagePath}`;

      const detectedObjects = [];

      if (ikRes.AllTags && Array.isArray(ikRes.AITags)) {
        ikRes.AITags.forEach((tag) => {
          if (tag.name && typeof tag.name === "string") {
            detectedObjects.push(tag.name.toLowerCase().trim());
          }
        });
      }

      const item = await Media.create({
        title: title || (isVideo ? "Untitled Video" : "Untitled Photo"),
        url: ikRes.url,
        thumbnailUrl,
        fileId: ikRes.fileId,
        size: ikRes.size || file.size,
        format: ikRes.fileType || (isVideo ? "mp4" : "jpg"),
        mediaType,
        duration: ikRes.duration || 0,
        width: ikRes.width || 1200,
        height: ikRes.height || 800,
        owner: req.user?.id,
        objects: detectedObjects,
      });

      uploadedMedia.push(item);
    }

    return res.status(201).json({
      success: true,
      message:
        uploadedMedia.length === 1
          ? "Successfully uploaded item."
          : `Successfully uploaded ${uploadedMedia.length} items.`,
      media: uploadedMedia,
    });
  } catch (error) {
    console.error(
      "Upload Media Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while uploading your media.",
      error: `Upload Media Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Get Media -------- */
export const getMedia = async (req, res) => {
  try {
    const { favorite, q, type } = req.query;
    const filter = { owner: req.user?.id, isTrash: false };

    if (favorite === "true") {
      filter.isFavorite = true;
    }

    if (type === "video" || type === "image") {
      filter.mediaType = type;
    }

    if (q && typeof q === "string" && q.trim()) {
      const searchTerm = q.trim();

      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { objects: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const media = await Media.find(filter).sort({ createdAt: -1 });

    const counts = media.reduce(
      (result, item) => {
        result.totalMedia++;

        if (item.mediaType === "image") {
          result.totalImages++;
        } else if (item.mediaType === "video") {
          result.totalVideos++;
        }

        return result;
      },
      {
        totalMedia: 0,
        totalImages: 0,
        totalVideos: 0,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        media.length === 0
          ? "No media found."
          : "Media retrieved successfully.",
      counts,
      media,
    });
  } catch (error) {
    console.error("Get Media Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving your media.",
      error: `Get Media Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Get Trash -------- */
export const getTrash = async (req, res) => {
  try {
    const media = await Media.find({
      owner: req.user?.id,
      isTrash: true,
    }).sort({ trashedAt: -1 });

    const counts = media.reduce(
      (result, item) => {
        result.totalTrash++;

        if (item.mediaType === "image") {
          result.totalImages++;
        } else if (item.mediaType === "video") {
          result.totalVideos++;
        }

        return result;
      },
      {
        totalTrash: 0,
        totalImages: 0,
        totalVideos: 0,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        media.length === 0
          ? "No trashed media found."
          : "Trash media retrieved successfully.",
      counts,
      media,
    });
  } catch (error) {
    console.error("Get Trash Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving your trash.",
      error: `Get Trash Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Empty Trash -------- */
export const emptyTrash = async (req, res) => {
  try {
    const trashedMedia = await Media.find({
      owner: req.user?.id,
      isTrash: true,
    });

    for (const item of trashedMedia) {
      try {
        await imagekit.files.delete(item.fileId);
      } catch (error1) {
        if (error1?.status === 404) {
          console.warn(
            `[ImageKit] File not found. Continuing database cleanup: ${item.fileId}`,
          );
        } else {
          console.error("[ImageKit] File deletion failed:", error1?.message);

          throw error1;
        }
      }

      await Album.updateMany(
        { photos: item._id },
        { $pull: { photos: item._id } },
      );

      await item.deleteOne();
    }

    return res.status(200).json({
      success: true,
      message:
        trashedMedia.length === 0
          ? "Your trash is already empty."
          : trashedMedia.length === 1
            ? "Trash emptied successfully. Item removed."
            : `Trash emptied successfully. ${trashedMedia.length} items removed.`,
    });
  } catch (error) {
    console.error(
      "Empty Trash Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while emptying your trash.",
      error: `Empty Trash Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Get Storage Stats -------- */
export const getStorageStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    const activeMedia = await Media.find({ owner: userId, isTrash: false });

    const favoriteCount = activeMedia.filter((p) => p.isFavorite).length;
    const totalBytes = activeMedia.reduce((sum, p) => sum + (p.size || 0), 0);

    const albumCount = await Album.countDocuments({ owner: userId });

    const videoCount = activeMedia.filter(
      (p) => p.mediaType === "video",
    ).length;

    const imageCount = activeMedia.length - videoCount;

    return res.status(200).json({
      success: true,
      message: "Storage statistics retrieved successfully.",
      mediaCount: activeMedia.length,
      imageCount,
      videoCount,
      favoriteCount,
      totalBytes,
      albumCount,
    });
  } catch (error) {
    console.error(
      "Get Storage Stats Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while retrieving storage statistics.",
      error: `Get Storage Stats Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Toggle Favorite -------- */
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided media ID is invalid.",
      });
    }

    const item = await Media.findOne({ _id: id, owner: req.user?.id });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "The requested media could not be found.",
      });
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    return res.status(200).json({
      success: true,
      message: item.isFavorite
        ? "Media added to favorites successfully."
        : "Media removed from favorites successfully.",
      media: item,
    });
  } catch (error) {
    console.error(
      "Toggle Favorite Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the favorite status.",
      error: `Toggle Favorite Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Toggle Trash -------- */
export const toggleTrash = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided media ID is invalid.",
      });
    }

    const { restore } = req.body || {};

    if (typeof restore !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "The restore value must be a boolean.",
      });
    }

    const item = await Media.findOne({ _id: id, owner: req.user?.id });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "The requested media could not be found.",
      });
    }

    if (item.isTrash === !restore) {
      return res.status(200).json({
        success: true,
        message: restore
          ? "Media is already restored."
          : "Media is already in trash.",
        media: item,
      });
    }

    item.isTrash = !restore;
    item.trashedAt = restore ? null : new Date();

    await item.save();

    return res.status(200).json({
      success: true,
      message: restore
        ? "Media restored successfully."
        : "Media moved to trash successfully.",
      media: item,
    });
  } catch (error) {
    console.error(
      "Toggle Trash Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the media trash status.",
      error: `Toggle Trash Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Delete Media Permanently -------- */
export const deleteMediaPermanent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided media ID is invalid.",
      });
    }

    const item = await Media.findOne({
      _id: id,
      owner: req.user?.id,
      isTrash: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "The requested media could not be found in trash.",
      });
    }

    if (item.fileId) {
      try {
        await imagekit.files.delete(item.fileId);
      } catch (error1) {
        if (error1?.status === 404) {
          console.warn(
            `[ImageKit] File not found. Continuing database cleanup: ${item.fileId}`,
          );
        } else {
          console.error("[ImageKit] File deletion failed:", error1?.message);
          throw error1;
        }
      }
    }

    await Album.updateMany(
      { photos: item._id },
      { $pull: { photos: item._id } },
    );

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Media permanently deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Media Permanently Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while permanently deleting your media.",
      error: `Delete Media Permanently Error: ${error?.stack || error?.message || error}`,
    });
  }
};
