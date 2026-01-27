// src/controllers/OrderController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // <--- Importas la fuente de datos
import { Order } from "../entities/Order";
import { EmailService } from "../services/EmailService";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";



export class OrderController {

  static getMyOrders = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId; // Obtenemos ID del token
    const orderRepo = AppDataSource.getRepository(Order);

    try {
      const orders = await orderRepo.find({
        where: { user: { id: userId } },
        relations: ["items", "items.product"], // Traemos los items y sus productos
        order: { createdAt: "DESC" } // Las más recientes primero
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial" });
    }
  };

  static create = async (req: Request, res: Response) => {
    // 1. Obtener datos
    const { items, shippingAddress } = req.body;
    // items espera ser: [{ productId: 1, quantity: 2 }, ...]

    const userId = res.locals.jwtPayload.userId;

    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);

    try {
      const user = await userRepo.findOneByOrFail({ id: userId });
      const order = new Order();
      order.user = user;
      order.shippingAddress = shippingAddress;
      order.status = "PENDING" as any;
      order.totalAmount = 0;
      order.items = [];

      // 2. Procesar cada item
      let total = 0;

      // Validamos que hay items
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "El carrito no puede estar vacío" });
      }

      for (const item of items) {
        const product = await productRepo.findOneBy({ id: item.productId });
        if (!product) return res.status(404).json({ message: `Producto ID ${item.productId} no encontrado` });

        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `No hay suficiente stock de ${product.name}` });
        }

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = item.quantity;
        orderItem.priceAtPurchase = product.price; // Guardamos el precio histórico

        // Sumamos al total
        total += Number(product.price) * item.quantity;

        // Agregamos al array de la orden
        order.items.push(orderItem);
      }

      order.totalAmount = total;

      // 3. Guardar en cascada (TypeORM guarda order e items automáticamente si está configurado cascade: true en la entidad)
      await orderRepo.save(order);

      res.status(201).json(order);

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al crear la orden" });
    }
  };

  // Método para listar mis órdenes
  /*static getMyOrders = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;
    const orderRepo = AppDataSource.getRepository(Order);

    const orders = await orderRepo.find({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
      order: { createdAt: "DESC" }
    });

    res.json(orders);
  };*/

  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const numericId = Number(id);
    const { status } = req.body; // Ej: "DELIVERED"

    // Verificamos si es un número válido
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const orderRepo = AppDataSource.getRepository(Order);

    // Ahora TypeScript sabe que 'numericId' es number
    const order = await orderRepo.findOne({
      where: { id: numericId },
      relations: ["user", "items", "items.product"]
    });

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    order.status = status;
    await orderRepo.save(order);

    if (status === "DELIVERED") {
      // 2. OBTENER LOS NOMBRES
      // Como una orden puede tener varios productos, creamos una lista
      // Ej: "iPhone 15, Funda protectora"
      const productNames = order.items
        .map(item => item.product.name)
        .join(", ");

      const emailService = new EmailService();

      // 3. ENVIAR EL CORREO CON LA LISTA
      await emailService.sendProductArrived(order.user.email, productNames);
    }

    res.json({ message: "Estado actualizado" });
  }


}