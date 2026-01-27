import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

export enum NotificationType {
  INFO = "info",
  SUCCESS = "success", // Ej: Pago recibido
  WARNING = "warning", // Ej: Pago fallido
  ORDER_UPDATE = "order_update" // Ej: Pedido enviado
}

@Entity()
export class AppNotification {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text") // "text" permite mensajes más largos que varchar
  message: string;

  @Column({ type: "enum", enum: NotificationType, default: NotificationType.INFO })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  // Opcional: Un enlace interno para redirigir al usuario al hacer clic
  // Ej: "/orders/123"
  @Column({ nullable: true })
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.notifications)
  user: User;
}