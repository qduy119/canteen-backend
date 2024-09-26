import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

interface ICloudinaryParams {
  folder: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function createStorage(folder: string) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `sample/${folder}`
    } as ICloudinaryParams
  });
}

const imagesStorage = createStorage('images');

export const upload = multer({ storage: imagesStorage });
