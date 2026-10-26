import multer from "multer";
import path from "node:path";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const profileUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      !allowedMimeTypes.has(file.mimetype) ||
      !allowedExtensions.has(extension)
    ) {
      const error = new Error(
        "Only JPG, PNG and WebP images are allowed."
      );

      error.status = 400;
      return callback(error);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default profileUpload;