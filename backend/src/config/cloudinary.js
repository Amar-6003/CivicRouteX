import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadBufferToCloudinary = (
  buffer,
  {
    folder,
    resourceType = "auto",
    publicId,
  }
) =>
  new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const deleteCloudinaryAsset = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

export default cloudinary;