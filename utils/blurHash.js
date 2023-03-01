import { encode } from "blurhash";
import sharp from "sharp";

const encodeImageToBlurHash = async (file, width, height) => {
  // read image with sharp
  const { data, info } = await sharp(file.path)
    .resize(width, height)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
  const pixelArray = new Uint8ClampedArray(data.buffer);
  return encode(pixelArray, width, height, 4, 4);
};

// const getImageData = (image) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;
//   const context = canvas.getContext("2d");
//   context.drawImage(image, 0, 0);
//   return context.getImageData(0, 0, image.width, image.height);
// };

// const encodeImageToBlurHash = async (imageUrl) => {
//   const image = await loadImage(imageUrl);
//   const imageData = getImageData(image);

// };

export default encodeImageToBlurHash;
