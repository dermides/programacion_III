// src/middlewares/checkRole.ts
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User";

export const checkRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Asumimos que un middleware de Auth previo ya inyectó res.locals.jwtPayload
    const userRole = res.locals.jwtPayload.role; 
    
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(401).send("No tienes permisos para realizar esta acción");
    }
  };
};