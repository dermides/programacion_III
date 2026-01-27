import { AppDataSource } from "../data-source"
import { Request, Response } from "express";
import { AppNotification, NotificationType } from "../entities/Notification";
import { User } from "../entities/User";

export class AdminOrderController {

  static async markAsShipped(req: Request, res: Response) {
    const { orderId, userId } = req.body;


    // 1. Lógica del negocio (Actualizar orden...)
    // ...

    // 2. PREPARAR NOTIFICACIÓN
    const userRepo = AppDataSource.getRepository(User);
    const notificationRepo = AppDataSource.getRepository(Notification);

    const user = await userRepo.findOne({ where: { id: userId } });

    // 1. Verificación de seguridad
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // notification.user = user; // Solo asignar después de comprobar que user no es null

    // 2. Crear notificación


    const newNotification = new AppNotification();
    newNotification.title = "¡Tu pedido está en camino!";
    newNotification.message = `La orden #${orderId} ha sido enviada por paquetería.`;
    newNotification.type = NotificationType.ORDER_UPDATE;
    newNotification.link = `/my-orders/${orderId}`;
    newNotification.user = user;

    // 3. GUARDAR EN DB (Persistencia)
    const savedNotification = await notificationRepo.save(newNotification);

    // 4. EMITIR EN TIEMPO REAL (Inmediatez)
    const io = req.app.get("socketio");

    // Enviamos el objeto completo guardado (con ID) para que el frontend pueda usarlo
    io.to(`user-${userId}`).emit("notification", savedNotification);

    res.json({ message: "Orden actualizada y usuario notificado" });
  }
}