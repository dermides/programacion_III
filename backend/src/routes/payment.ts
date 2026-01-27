import { Router } from "express";
// Importa el controlador con el nombre EXACTO que usaste
import { PaypalController } from "../controller/PaypalController"; 
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Así se forma: /payments (del index) + /create-order (de aquí)
router.post("/create-order", [checkJwt], PaypalController.createOrder);

// Capturar el pago (confirmar compra)
router.post("/capture-order", [checkJwt], PaypalController.captureOrder);

export default router;