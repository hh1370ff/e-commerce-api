import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const cloudinaryUploadImg = async (fileToUploads) => {
  console.log(
    "🚀 ~ file: cloudinary.js:14 ~ cloudinaryUploadImg ~ fileToUploads:",
    fileToUploads
  );
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads.path, (error, result) => {
      console.log(
        "🚀 ~ file: cloudinary.js:20 ~ cloudinary.uploader.upload ~ fileToUploads.path:",
        fileToUploads.path
      );
      if (error) {
        reject(error);
      } else {
        fs.unlinkSync(fileToUploads.path);
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    });
  });
};

export const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (result) => {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      }
    });
  });
};
