import { Router } from "express";
import { WalletController } from "../controller/WalletController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Ver saldo
router.get("/", [checkJwt], WalletController.getMyWallet);

// Recargar (POST)
router.post("/recharge", [checkJwt], WalletController.recharge);

// Pagar Orden (POST)
router.post("/pay-order", [checkJwt], WalletController.payOrder);

export default router;