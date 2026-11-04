// Server / controllers / albumControllers.js
import Album from "../models/Album.js";
import mongoose from "mongoose";
import Media from "../models/Media.js";

/* -------- Create Album -------- */
export const createAlbum = async (req, res) => {
  try {
    const { title, description, photoIds } = req.body;

    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Album title must be a valid string.",
      });
    }

    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Album title is required.",
      });
    }

    let validPhotos = [];

    if (photoIds !== undefined) {
      if (!Array.isArray(photoIds)) {
        return res.status(400).json({
          success: false,
          message: "Photo IDs must be provided as an array.",
        });
      }

      if (photoIds.some((photoId) => typeof photoId !== "string")) {
        return res.status(400).json({
          success: false,
          message: "All photo IDs must be provided as strings.",
        });
      }

      if (
        photoIds.some((photoId) => !mongoose.Types.ObjectId.isValid(photoId))
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more photo IDs are invalid.",
        });
      }

      const uniquePhotoIds = [...new Set(photoIds)];

      const foundPhotos = await Media.find({
        _id: { $in: uniquePhotoIds },
        owner: req.user?.id,
        isTrash: false,
      }).select("_id");

      if (foundPhotos.length !== uniquePhotoIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected photos were not found or are unavailable.",
        });
      }

      validPhotos = uniquePhotoIds;
    }

    const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingAlbum = await Album.findOne({
      title: { $regex: `^${escapedTitle}$`, $options: "i" },
      owner: req.user?.id,
    });

    if (existingAlbum) {
      return res.status(409).json({
        success: false,
        message: "An album with this title already exists.",
      });
    }

    const album = await Album.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      owner: req.user?.id,
      photos: validPhotos,
    });

    const populated = await Album.findById(album._id)
      .populate("owner", "name email")
      .populate({
        path: "photos",
        match: { isTrash: false },
        select: "thumbnailUrl url mediaType title",
      });

    return res.status(201).json({
      success: true,
      message:
        validPhotos.length > 0
          ? "Album created and photos added successfully."
          : "Album created successfully. No photos were added.",
      album: populated || album,
    });
  } catch (error) {
    console.error(
      "Create Album Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the album.",
      error: `Create Album Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Get My Albums -------- */
export const getMyAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ owner: req.user?.id })
      .populate("owner", "name email")
      .populate({
        path: "photos",
        match: { isTrash: false },
        select: "thumbnailUrl url mediaType title",
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message:
        albums.length === 0
          ? "No albums found."
          : albums.length === 1
            ? "Album retrieved successfully."
            : "Albums retrieved successfully.",
      count: albums.length,
      albums,
    });
  } catch (error) {
    console.error(
      "Get My Albums Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving your albums.",
      error: `Get My Albums Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Get Album By ID -------- */
export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided album ID is invalid.",
      });
    }

    const album = await Album.findOne({ _id: id, owner: req.user?.id })
      .populate("owner", "name email")
      .populate({
        path: "photos",
        match: { isTrash: false },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ updatedAt: -1 });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "The requested album could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album retrieved successfully.",
      album,
    });
  } catch (error) {
    console.error(
      "Get Album By ID Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving the album.",
      error: `Get Album By ID Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Delete Album -------- */
export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided album ID is invalid.",
      });
    }

    const album = await Album.findOneAndDelete({
      _id: id,
      owner: req.user?.id,
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "The requested album could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Album deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Album Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the album.",
      error: `Delete Album Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Add Photos To Album -------- */
export const addPhotosToAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided album ID is invalid.",
      });
    }

    const { photoIds } = req.body || {};

    if (!Array.isArray(photoIds)) {
      return res.status(400).json({
        success: false,
        message: "Photo IDs must be provided as an array.",
      });
    }

    if (photoIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one photo ID.",
      });
    }

    if (photoIds.some((photoId) => typeof photoId !== "string")) {
      return res.status(400).json({
        success: false,
        message: "All photo IDs must be provided as strings.",
      });
    }

    if (photoIds.some((photoId) => !mongoose.Types.ObjectId.isValid(photoId))) {
      return res.status(400).json({
        success: false,
        message: "One or more photo IDs are invalid.",
      });
    }

    const album = await Album.findOne({ _id: id, owner: req.user?.id });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "The requested album could not be found.",
      });
    }

    const uniquePhotoIds = [...new Set(photoIds)];

    const validPhotos = await Media.find({
      _id: { $in: uniquePhotoIds },
      owner: req.user?.id,
      isTrash: false,
    }).select("_id");

    if (validPhotos.length !== uniquePhotoIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Some selected photos are invalid, unavailable, or do not belong to your account.",
      });
    }

    const updatedPhotos = Array.from(
      new Set([...album.photos.map((p) => p.toString()), ...photoIds]),
    );

    album.photos = updatedPhotos;

    await album.save();

    const populated = await Album.findById(id).populate({
      path: "photos",
      match: { isTrash: false },
    });

    return res.status(200).json({
      success: true,
      message: "Photos added to the album successfully.",
      album: populated,
    });
  } catch (error) {
    console.error(
      "Add Photos To Album Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding photos to the album.",
      error: `Add Photos To Album Error: ${error?.stack || error?.message || error}`,
    });
  }
};

/* -------- Remove Photos From Album -------- */
export const removePhotosFromAlbum = async (req, res) => {
  try {
    const { id, photoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "The provided album ID is invalid.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(photoId)) {
      return res.status(400).json({
        success: false,
        message: "The provided photo ID is invalid.",
      });
    }

    const album = await Album.findOne({ _id: id, owner: req.user?.id });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "The requested album could not be found.",
      });
    }

    const photoExists = album.photos.some((p) => p.toString() === photoId);

    if (!photoExists) {
      return res.status(404).json({
        success: false,
        message: "The requested photo could not be found in this album.",
      });
    }

    album.photos = album.photos.filter((p) => p.toString() !== photoId);

    await album.save();

    return res.status(200).json({
      success: true,
      message: "Photo removed from the album successfully.",
      album,
    });
  } catch (error) {
    console.error(
      "Remove Photos From Album Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while removing the photo from the album.",
      error: `Remove Photos From Album Error: ${error?.stack || error?.message || error}`,
    });
  }
};
