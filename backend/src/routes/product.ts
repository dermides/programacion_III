import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../entities/User";
import { upload } from "../middlewares/upload";

const router = Router();

// Rutas Públicas
router.get("/", ProductController.getAll);

router.get("/:id", ProductController.getById);

// Crear (Admin + Upload Array)
router.post("/", [checkJwt, checkRole([UserRole.ADMIN, UserRole.SELLER]), upload], ProductController.create);

// Editar (Admin + Upload Array por si quiere cambiar fotos)
router.put("/:id", [checkJwt, checkRole([UserRole.ADMIN, UserRole.SELLER]), upload], ProductController.update);

// Eliminar (Admin)
router.delete("/:id", [checkJwt, checkRole([UserRole.ADMIN, UserRole.SELLER])], ProductController.delete);

export default router;