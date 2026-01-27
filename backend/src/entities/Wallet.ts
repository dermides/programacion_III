import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { WalletTransaction } from "./WalletTransaction";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  // Usamos 'decimal' para dinero. 10 dígitos total, 2 decimales.
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToOne(() => User, user => user.wallet)
  @JoinColumn()
  user: User;

  @OneToMany(() => WalletTransaction, transaction => transaction.wallet)
  transactions: WalletTransaction[];
}