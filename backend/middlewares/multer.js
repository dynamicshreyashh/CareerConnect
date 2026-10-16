import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    const isImage = file.mimetype.startsWith("image/");
    const isDocument = /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/.test(file.mimetype);
    if (file.fieldname === "logo" || file.fieldname === "profilePhoto") {
      return callback(isImage ? null : new Error("Please upload a valid image file."), isImage);
    }
    if (file.fieldname === "file") {
      return callback((isImage || isDocument) ? null : new Error("Please upload a PDF, DOC, DOCX, or image file."), (isImage || isDocument));
    }
    return callback(new Error("Unexpected upload field."));
  },
});

export const allowAny = upload.any();
export const profileUpload = upload.single("file");
export const companyLogoUpload = upload.single("logo");
