import multer from "multer";

const storage = multer.memoryStorage();

/* -------- Configure Multer Upload -------- */
export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 20,
  },

  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error("Only image and video files are allowed."), {
          status: 400,
        }),
      );
    }
  },
});
