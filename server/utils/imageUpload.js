const { cloudinaryInstance } = require("../config/cloudinary");

const handleImageUpload = async (path) => {
  try {
    const uploadResult = await cloudinaryInstance.uploader.upload(path);
    return uploadResult.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

module.exports = { handleImageUpload };