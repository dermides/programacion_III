import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: "uploads", // Carpeta donde se guardarán
  filename: (req, file, cb) => {
    // Generamos nombre único: "uuid-timestamp.extensión"
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

// Middleware listo para usar
export const upload = multer({ 
  storage,
  limits: { fileSize: 2000000 }, // Límite de 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, webp)"));
  }
}).array("images", 6); 