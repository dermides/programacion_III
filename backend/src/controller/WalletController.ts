import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Wallet } from "../entities/Wallet";
import { WalletTransaction, TransactionType } from "../entities/WalletTransaction";
import { User } from "../entities/User";
import { Order } from "../entities/Order";

export class WalletController {

    // Ver mi saldo y movimientos
    static getMyWallet = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const walletRepo = AppDataSource.getRepository(Wallet);

        try {
            const wallet = await walletRepo.findOne({
                where: { user: { id: userId } },
                relations: ["transactions"],
                order: { transactions: { createdAt: "DESC" } } // Lo más nuevo primero
            });

            if (!wallet) {
                // Si no tiene wallet (usuarios viejos), creamos una al vuelo
                // Esto es opcional, pero ayuda a evitar errores
                return res.status(404).json({ message: "Billetera no encontrada" });
            }

            res.json(wallet);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener billetera" });
        }
    };

    // Recargar saldo (Simulado: en prod esto vendría de un webhook de PayPal/Stripe)
    static recharge = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const { amount } = req.body; // Ej: 100.00

        if (!amount || amount <= 0) return res.status(400).json({ message: "Monto inválido" });

        const walletRepo = AppDataSource.getRepository(Wallet);
        const transactionRepo = AppDataSource.getRepository(WalletTransaction);

        try {
            const wallet = await walletRepo.findOneByOrFail({ user: { id: userId } });

            // 1. Crear Transacción
            const transaction = new WalletTransaction();
            transaction.amount = amount;
            transaction.type = TransactionType.DEPOSIT;
            transaction.description = "Recarga de saldo";
            transaction.wallet = wallet;
            await transactionRepo.save(transaction);

            // 2. Actualizar Saldo (Ojo: TypeORM devuelve decimal como string, convertimos a Number)
            wallet.balance = Number(wallet.balance) + Number(amount);
            await walletRepo.save(wallet);

            res.json({ message: "Recarga exitosa", newBalance: wallet.balance });

        } catch (error) {
            res.status(500).json({ message: "Error en recarga" });
        }
    };

    // Pagar una Orden con Billetera
    static payOrder = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const { orderId } = req.body;

        const walletRepo = AppDataSource.getRepository(Wallet);
        const orderRepo = AppDataSource.getRepository(Order);
        const transactionRepo = AppDataSource.getRepository(WalletTransaction);

        // Usamos Transaction Manager para asegurar que todo ocurra o nada ocurra (Atomicidad)
        await AppDataSource.manager.transaction(async transactionalEntityManager => {
            // 1. Buscar Wallet
            const wallet = await transactionalEntityManager.findOne(Wallet, {
                where: { user: { id: userId } }
            });

            if (!wallet) {
                throw new Error("Billetera no encontrada");
            }

            // 2. Buscar Orden
            const order = await transactionalEntityManager.findOne(Order, {
                where: { id: orderId, user: { id: userId } }
            });

            if (!order) throw new Error("Orden no encontrada");
            if (order.status !== "PENDING" as any) throw new Error("La orden ya fue pagada o cancelada");

            // 3. Verificar Saldo
            if (Number(wallet.balance) < Number(order.totalAmount)) {
                throw new Error("Saldo insuficiente");
            }

            // 4. Descontar Dinero
            wallet.balance = Number(wallet.balance) - Number(order.totalAmount);
            await transactionalEntityManager.save(wallet);

            // 5. Registrar Transacción de Salida
            const transaction = new WalletTransaction();
            transaction.amount = order.totalAmount;
            transaction.type = TransactionType.PURCHASE;
            transaction.description = `Pago de Orden #${order.id}`;
            transaction.wallet = wallet;
            await transactionalEntityManager.save(transaction);

            // 6. Marcar Orden como PAGADA
            order.status = "PAID" as any; // Asegúrate de tener 'PAID' en tu enum de Order
            await transactionalEntityManager.save(order);

        }).then(() => {
            res.json({ message: "Pago realizado con éxito" });
        }).catch(error => {
            res.status(400).json({ message: error.message });
        });
    };
}