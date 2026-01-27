import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Wallet } from "./Wallet";

export enum TransactionType {
    DEPOSIT = "DEPOSIT",       // Recarga de saldo (Paypal/Binance)
    WITHDRAWAL = "WITHDRAWAL", // Retiro (si permites a vendedores sacar dinero)
    PURCHASE = "PURCHASE",     // Compra de producto
    REFUND = "REFUND"          // Reembolso
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: "enum", enum: TransactionType })
    type: TransactionType;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Wallet, wallet => wallet.transactions)
    wallet: Wallet;
}