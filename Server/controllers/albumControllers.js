// Server / controllers / albumControllers.js
import Album from "../models/Album.js";

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

    const validPhotos = Array.isArray(photoIds) ? photoIds : [];

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
      message: "Album created successfully.",
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
