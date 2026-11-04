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
