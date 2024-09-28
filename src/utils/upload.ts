import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { upload } from './cloudinary';
import { CustomError } from './error';

export const imagesUploadHandler =
  (field: string, n_images: number) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.array(field, n_images)(req, res, (error: any) => {
      if (error instanceof multer.MulterError) {
        next(new CustomError(Number(error.code), error.message));
      } else if (error) {
        next(error);
      }
      next();
    });
  };

export const imageUpload =
  (field: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(field)(req, res, (error: any) => {
      if (error instanceof multer.MulterError) {
        next(new CustomError(Number(error.code), error.message));
      } else if (error) {
        next(error);
      }
      next();
    });
  };
