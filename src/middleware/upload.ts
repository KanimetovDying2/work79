import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const randomName = crypto.randomUUID();
    cb(null, `${randomName}${extension}`);
  },
});

export const imagesUpload = multer({ storage });
