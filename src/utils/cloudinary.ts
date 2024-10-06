import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import envConfig from '@/config';

interface ICloudinaryParams {
  folder: string;
}

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET
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
