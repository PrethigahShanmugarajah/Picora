// Server / controllers / mediaControllers.js
import { imagekit, toFile } from "../config/imageKit.js";
import { imagekitUrlEndpoint } from "../config/env.js";
import Media from "../models/Media.js";

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
      const imagePath = ikRes.filePath;
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

    return res.status(200).json({
      success: true,
      message:
        media.length === 0
          ? "No trashed media found."
          : "Trash media retrieved successfully.",
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
