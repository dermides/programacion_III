import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Wallet } from "./Wallet";

export enum TransactionType {
  DEPOSIT = "deposit", // Recarga
  PURCHASE = "purchase" // Compra
}

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
      type: "enum",
      enum: TransactionType,
      default: TransactionType.DEPOSIT // Es bueno tener un default para evitar nulos
  })
  type: TransactionType;

  @Column({ nullable: true })
  description: string; // Ej: "Pago Orden #5"

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  wallet: Wallet;
}