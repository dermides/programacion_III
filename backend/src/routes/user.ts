import { Router } from "express";
import { UserController } from "../controller/UserController";
import { checkJwt } from "../middlewares/checkJwt"; // Asumiendo que creaste el middleware anterior
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../entities/User";

const router = Router();

// Obtener todos los usuarios (Solo ADMIN)
// 2. CORRECCIÓN: Usar [UserRole.ADMIN] en vez de ["admin"]
router.get("/", [checkJwt, checkRole([UserRole.ADMIN])], UserController.getAll);

// Obtener un usuario
router.get("/:id", [checkJwt], UserController.getOne);

export default router;