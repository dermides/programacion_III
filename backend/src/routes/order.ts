import { Router } from "express";
import { OrderController } from "../controller/OrderController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Crear orden (Requiere login)
//router.post("/", [checkJwt], OrderController.create);

// Ver mis órdenes
//router.get("/", [checkJwt], OrderController.getMyOrders);

// ...
// IMPORTANTE: Pon esta ruta ANTES de router.get("/:id") si existiera
router.get("/my-orders", [checkJwt], OrderController.getMyOrders);
router.post("/", [checkJwt], OrderController.create);
// ...

export default router;