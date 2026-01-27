import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { IsEmail, MinLength, IsNotEmpty } from "class-validator";
import { Wallet } from "./Wallet";
import { Order } from "./Order";
import { AppNotification } from "./Notification";

export enum UserRole {
  ADMIN = "admin",
  SELLER = "seller",
  CUSTOMER = "customer"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail({}, { message: "El correo debe ser válido" }) // <--- Regla 1
  @IsNotEmpty({ message: "El correo es requerido" })
  email: string;

  @Column({ select: false }) 
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" }) // <--- Regla 2
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  // Sistema de Crédito (Billetera interna)
  @OneToOne(() => Wallet, wallet => wallet.user, { cascade: true })
  @JoinColumn()
  wallet: Wallet;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => AppNotification, notification => notification.user)
  notifications: AppNotification[];

  

}