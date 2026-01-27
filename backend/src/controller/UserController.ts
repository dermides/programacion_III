import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UserController {
  static getAll = async (req: Request, res: Response) => {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({ select: ["id", "email", "role"] }); // No devolvemos passwords
    res.json(users);
  };

  static getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRepo = AppDataSource.getRepository(User);
    try {
      const user = await userRepo.findOneOrFail({ where: { id: Number(id) } });
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  };
}