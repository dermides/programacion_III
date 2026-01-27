import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["auth"]; // O req.headers["authorization"]
  let jwtPayload;

  try {
    const cleanToken = token.replace("Bearer ", ""); // Limpiar el string
    jwtPayload = <any>jwt.verify(cleanToken, process.env.JWT_SECRET || "SEMILLA_SECRETA");
    res.locals.jwtPayload = jwtPayload; // Guardamos los datos para usarlos en el controlador
  } catch (error) {
    return res.status(401).json({ message: "No autorizado" });
  }

  // Renovar token (opcional) cada vez que se usa para mantener sesión viva
  const { userId, email } = jwtPayload;
  const secret = process.env.JWT_SECRET || "SEMILLA_SECRETA";
  const newToken = jwt.sign({ userId, email }, secret, { expiresIn: "1h" });
  res.setHeader("token", newToken);

  next();
};