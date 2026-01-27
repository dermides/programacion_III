// src/controllers/PaymentController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // <--- Importas la fuente de datos
import { Wallet } from "../entities/Wallet";
// Importar SDKs de PayPal o Binance aquí

export class PaymentController {

  // Webhook que recibe notificación de Binance/Paypal
  static async handleWebhook(req: Request, res: Response) {
    const { paymentId, status, amount, userId } = req.body; // Datos simplificados

    if (status === "COMPLETED") {
      const walletRepo = AppDataSource.getRepository(Wallet);
      const wallet = await walletRepo.findOne({ where: { user: { id: userId } } });

      if (wallet) {
        wallet.balance = Number(wallet.balance) + Number(amount);
        await walletRepo.save(wallet);

        // Aquí podrías disparar el correo de "Pago Recibido"
      }
    }
    res.status(200).send("OK");
  }

  static async payWithWallet(req: Request, res: Response) {
    const { userId, amount } = req.body;
    const walletRepo = AppDataSource.getRepository(Wallet);
    const wallet = await walletRepo.findOne({ where: { user: { id: userId } } });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet no encontrada" });
    }

    if (wallet.balance >= amount) {
      wallet.balance -= amount;
      await walletRepo.save(wallet);
      // Proceder a crear la orden...
      res.json({ success: true, message: "Compra realizada con saldo interno" });
    } else {
      res.status(400).json({ message: "Saldo insuficiente" });
    }
  }
}