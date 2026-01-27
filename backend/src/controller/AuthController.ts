import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { validate } from "class-validator";

export class AuthController {

  static login = async (req: Request, res: Response) => {
    // 1. Obtener credenciales del body
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }

    // 2. Buscar usuario en la base de datos
    const userRepo = AppDataSource.getRepository(User);
    let user: User;

    try {
      // Necesitamos seleccionar el password porque en la Entidad pusimos { select: false }
      user = await userRepo.findOneOrFail({
        where: { email },
        select: ["id", "email", "password", "role"]
      });
    } catch (error) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // 3. Verificar la contraseña (Hash vs Texto plano)
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // 4. Generar Token JWT
    // IMPORTANTE: Cambia 'SEMILLA_SECRETA' por una variable de entorno segura en producción
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "SEMILLA_SECRETA",
      { expiresIn: "1h" }
    );

    // 5. Enviar token
    res.json({ message: "Login exitoso", token, role: user.role, userId: user.id });
  };

  static register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    
    const user = new User();

    if (role && Object.values(UserRole).includes(role)) {
      user.role = role as UserRole;
    } else {
      // Si envían basura o nada, asignamos cliente por defecto
      user.role = UserRole.CUSTOMER;
    }

    user.email = email;
    user.password = password; // Se encriptará automáticamente si usas @BeforeInsert en la entidad, o hazlo aquí manual.
    user.role = (role as UserRole) || UserRole.CUSTOMER;

    // Encriptado manual si no tienes el hook en la entidad:
    user.password = bcrypt.hashSync(password, 8);

    // Validar errores (opcional, requiere class-validator)

    const errors = await validate(user);

    if (errors.length > 0) {
      // Mapeamos los errores para que sean legibles en la respuesta
      const messages = errors.flatMap(error =>
        error.constraints ? Object.values(error.constraints) : []
      );

      return res.status(400).json({
        message: "Error de validación",
        errors: messages
      });
    }

    const userRepo = AppDataSource.getRepository(User);

    try {
      await userRepo.save(user);
    } catch (e) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    res.status(201).json({ message: "Usuario creado" });
  };
}