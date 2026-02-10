import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // <--- Importas la fuente de datos
import { AppNotification } from "../entities/Notification";

export class NotificationController {

  static async getMyNotifications(req: Request, res: Response) {
    const userId = res.locals.jwtPayload.userId; 

    // FORMA CORRECTA EN TYPEORM 0.3
    const notificationRepo = AppDataSource.getRepository(AppNotification);
    
    const notifications = await notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
      take: 20
    });

    res.json(notifications);
  }

  static async markAsRead(req: Request, res: Response) {
    const { id } = req.params;
    const userId = res.locals.jwtPayload.userId;

    // Obtener repositorio de la instancia
    const notificationRepo = AppDataSource.getRepository(AppNotification);
    
    const notification = await notificationRepo.findOne({ 
        where: { id: Number(id), user: { id: userId } } 
    });

    if (notification) {
      notification.isRead = true;
      await notificationRepo.save(notification);
    }

    res.json({ success: true });
  }
}