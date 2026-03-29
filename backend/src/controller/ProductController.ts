import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import * as fs from "fs";
import * as path from "path";
import { ProductImage } from "../entities/ProductImage";


const deleteFile = (fileName: string) => {
  const filePath = path.resolve("uploads", fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}


export class ProductController {
  
  static getAll = async (req: Request, res: Response) => {
    
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find();

    res.json(products);

  };

  static create = async (req: Request, res: Response) => {
    const { name, price, stock, description } = req.body;
    // Multer ahora populan req.files (array) en vez de req.file
    const files = req.files as Express.Multer.File[];

    const productRepo = AppDataSource.getRepository(Product);

    try {
      const product = new Product();
      product.name = name;
      product.price = parseFloat(price);
      product.stock = parseInt(stock);
      product.description = description;
      // Inicializamos el array
      product.images = [];

      // Si hay archivos subidos, creamos las entidades ProductImage
      if (files && files.length > 0) {
        files.forEach(file => {
          const img = new ProductImage();
          img.fileName = file.filename;
          product.images.push(img);
        });
      }

      // Gracias a cascade: true, esto guarda el producto y sus imágenes de una vez
      await productRepo.save(product);
      res.status(201).json({ message: "Producto creado", product });

    } catch (e) {
      // Si falla, limpiamos las fotos que se acaban de subir
      if (files) files.forEach(f => deleteFile(f.filename));
      res.status(500).json({ message: "Error al crear producto" });
    }
  };

  static update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    const files = req.files as Express.Multer.File[];

    const productRepo = AppDataSource.getRepository(Product);
    const imageRepo = AppDataSource.getRepository(ProductImage);

    try {
      // Buscamos el producto con sus imágenes actuales
      const product = await productRepo.findOneBy({ id: Number(id) });
      if (!product) {
        if (files) files.forEach(f => deleteFile(f.filename));
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Actualizamos campos de texto
      if (name) product.name = name;
      if (price) product.price = parseFloat(price);
      if (stock) product.stock = parseInt(stock);
      if (description) product.description = description;

      // Lógica de imágenes: Si subieron nuevas, reemplazamos.
      if (files && files.length > 0) {
        // 1. Borrar fotos viejas físicas
        product.images.forEach(img => deleteFile(img.fileName));

        // 2. Borrar fotos viejas de la BD
        await imageRepo.remove(product.images);

        // 3. Crear y asignar nuevas fotos
        product.images = files.map(file => {
          const img = new ProductImage();
          img.fileName = file.filename;
          return img;
        });
      }

      await productRepo.save(product);
      res.json({ message: "Producto actualizado", product });

    } catch (error) {
      // Si falla, borramos las fotos nuevas que se subieron
      if (files) files.forEach(f => deleteFile(f.filename));
      res.status(500).json({ message: "Error al actualizar" });
    }
  };

  static delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productRepo = AppDataSource.getRepository(Product);

    try {
      const product = await productRepo.findOneBy({ id: Number(id) });
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      // 1. Borrar imágenes físicas del servidor
      if (product.images) {
        product.images.forEach(img => deleteFile(img.fileName));
      }

      // 2. Borrar producto de la BD (el CASCADE borrará las filas en product_image)
      await productRepo.remove(product);

      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar" });
    }
  };

  // Obtener un producto por ID
  static getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productRepo = AppDataSource.getRepository(Product);

    try {
      // Buscamos por ID y cargamos las imágenes (relations)
      // Nota: Si usaste 'eager: true' en la entidad, no necesitas 'relations' aquí, 
      // pero ponerlo no hace daño.
      const product = await productRepo.findOne({
        where: { id: Number(id) },
        relations: ["images"] 
      });

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el producto" });
    }
  };


}