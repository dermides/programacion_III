import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

export class FavoriteController {

  static toggleLike = async (req: Request, res: Response) => {
    const { id } = req.params; // ID del producto
    const userId = res.locals.jwtPayload.userId;

    const productRepo = AppDataSource.getRepository(Product);
    const userRepo = AppDataSource.getRepository(User);

    try {
      // 1. Buscamos el producto y cargamos quiénes le han dado like
      const product = await productRepo.findOne({
        where: { id: Number(id) },
        relations: ["likedBy"]
      });

      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      // 2. Buscamos al usuario actual
      const user = await userRepo.findOneByOrFail({ id: userId });

      // 3. Verificamos si ya le dio like
      // (Buscamos en el array likedBy si existe el ID del usuario)
      const index = product.likedBy.findIndex(u => u.id === user.id);

      let message = "";

      if (index > -1) {
        // YA TIENE LIKE -> LO QUITAMOS (Dislike)
        product.likedBy.splice(index, 1);
        message = "Producto eliminado de favoritos";
      } else {
        // NO TIENE LIKE -> LO AGREGAMOS (Like)
        product.likedBy.push(user);
        message = "Producto agregado a favoritos";
      }

      // 4. Guardamos el cambio en la tabla intermedia
      await productRepo.save(product);

      res.json({ message, liked: index === -1 }); // devolvemos el nuevo estado

    } catch (error) {
      res.status(500).json({ message: "Error al actualizar favoritos" });
    }
  };

  // Ver mis productos favoritos
  static getMyFavorites = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;
    const productRepo = AppDataSource.getRepository(Product);

    // Buscamos productos donde en su lista de 'likedBy' esté mi ID
    const favorites = await productRepo.find({
      where: {
        likedBy: { id: userId }
      }
    });

    res.json(favorites);
  };
}