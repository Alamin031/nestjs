import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = (field: string) => {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const destination = `./uploads/${file.fieldname}`;
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        const fileExtension = extname(file.originalname);
        const fileName = `${randomName}${fileExtension}`;
        cb(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedExtensionsRegex = /^.*\.(jpg|webp|png|jpeg|csv)$/i;
      console.log(file);

      if (allowedExtensionsRegex.test(file.originalname)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  };
};
