import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
    PENDING = "PENDING",       // Creada pero no pagada
    PAID = "PAID",             // Pagada
    SHIPPED = "SHIPPED",       // Enviada
    DELIVERED = "DELIVERED",   // Entregada
    CANCELLED = "CANCELLED"    // Cancelada
}

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column("decimal", { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ nullable: true })
    shippingAddress: string;

    @Column({ nullable: true })
    trackingNumber: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relación: Un usuario tiene muchas órdenes
    @ManyToOne(() => User, user => user.orders)
    user: User;

    // Relación: Una orden tiene muchos items (productos)
    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    items: OrderItem[];
}