import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User";
import { ProductImage } from "./ProductImage";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  // cascade: true permite guardar las imágenes al guardar el producto
  // eager: true hace que siempre que consultes un producto, traiga su array de imágenes
  @OneToMany(() => ProductImage, image => image.product, { cascade: true, eager: true })
  images: ProductImage[];

  @ManyToOne(() => User, user => user.id) // El vendedor
  seller: User;

  // Módulo de "Me Gusta" / Favoritos
  @ManyToMany(() => User)
  @JoinTable()
  likedBy: User[];
}