import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";
import { Wallet } from "./entities/Wallet";
import { AppNotification } from "./entities/Notification";
import { OrderItem } from "./entities/OrderItem";
import { Transaction } from "./entities/Transaction";
import { WalletTransaction } from "./entities/WalletTransaction";
import { ProductImage } from "./entities/ProductImage";


import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "ecommerce_db",
    synchronize: true, // ¡OJO! Solo en desarrollo (dev). En prod ponlo en false.
    logging: false,
    entities: [
        User,
        Product,
        Order,
        OrderItem,
        AppNotification,
        Transaction,
        Wallet,
        WalletTransaction,
        ProductImage
    ], 
    subscribers: [],
    migrations: [],
});