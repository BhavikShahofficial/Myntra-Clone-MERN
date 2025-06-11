const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dfdxacdv5",
  api_key: "926436816465338",
  api_secret: "v62sb0Urd-i-kRAWRaYvmevfLJ4",
});

const storage = new multer.memoryStorage();

async function ImageUploadUtils(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });
module.exports = { upload, ImageUploadUtils };
