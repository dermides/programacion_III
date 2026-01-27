import { Request, Response } from "express";
import client from "../config/paypal";
import paypal from '@paypal/checkout-server-sdk';
import { AppDataSource } from "../data-source"; // <--- Importas la fuente de datos
import { Order, OrderStatus } from "../entities/Order"; // Asumiendo que tienes esta entidad y enum

export class PaypalController {

  // 1. Crear la orden y devolver el link de aprobación al frontend
  static async createOrder(req: Request, res: Response) {
    const { totalAmount } = req.body; // El monto total de la compra

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalAmount.toString()
        }
      }]
    });

    try {
      const order = await client.execute(request);
      // Devuelves el ID de la orden al frontend para que muestre el botón de PayPal
      res.json({ id: order.result.id });
    } catch (e) {
      let message = 'Unknown error';
      if (e instanceof Error) {
        message = e.message;
      } else if (typeof e === 'object' && e !== null && 'message' in e) {
        message = (e as any).message;
      }
      res.status(500).json({ error: message });
    }
  }

  // 2. Capturar el dinero una vez el usuario aprobó en el frontend
  static async captureOrder(req: Request, res: Response) {
    const { orderID, userId } = req.body; // ID que te da PayPal y tu usuario

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({} as any);

    try {
      const capture = await client.execute(request);

      // VERIFICACIÓN: Si el estado es COMPLETED, el dinero es tuyo
      if (capture.result.status === 'COMPLETED') {

        // AQUÍ ACTUALIZAS TU BASE DE DATOS
        // Ejemplo:
        const orderRepo = AppDataSource.getRepository(Order);
        await orderRepo.update({ user: userId, status: OrderStatus.PENDING }, { status: OrderStatus.PAID });

        res.json({ status: 'success', data: capture.result });
      }
    } catch (e) {
      res.status(500).json({ error: "Error al capturar el pago" });
    }
  }
}