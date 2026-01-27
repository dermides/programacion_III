import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const router = Router();

// Login
router.post("/login", AuthController.login);

// Register
router.post("/register", AuthController.register);

export default router;