import { Router } from "express";
import { FavoriteController } from "../controller/FavoriteController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Dar o quitar like: POST /favorites/product/:id
router.post("/product/:id", [checkJwt], FavoriteController.toggleLike);

// Ver mi lista: GET /favorites
router.get("/", [checkJwt], FavoriteController.getMyFavorites);

export default router;