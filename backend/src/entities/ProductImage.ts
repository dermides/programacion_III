import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string; // Ej: "uuid-foto1.jpg"

  // Relación: Muchas imágenes pertenecen a un Producto
  // onDelete: "CASCADE" es VITAL: si borras el producto, se borran sus fotos en BD automáticamente.
  @ManyToOne(() => Product, product => product.images, { onDelete: "CASCADE" })
  product: Product;
}