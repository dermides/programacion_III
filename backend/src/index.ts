import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./data-source"; // <--- IMPORTANTE
import { User, UserRole } from "./entities/User"; // Tu entidad User
import * as bcrypt from "bcryptjs";
import routes from "./routes";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });



// Inicializar la conexión a BD
AppDataSource.initialize()
    .then(async () => {
        console.log("Base de datos conectada correctamente (TypeORM 0.3)");

        // --- PEGA ESTO AQUÍ ADENTRO ---
        const userRepository = AppDataSource.getRepository(User);
        const adminExists = await userRepository.findOneBy({ role: UserRole.ADMIN });

        if (!adminExists) {
            const adminUser = new User();
            adminUser.email = "admin@mitienda.com";

            // Encriptar contraseña
            const salt = bcrypt.genSaltSync(10);
            adminUser.password = bcrypt.hashSync("12345678", salt);
            adminUser.role = UserRole.ADMIN;

            await userRepository.save(adminUser);
            console.log("✅ Admin creado: admin@mitienda.com | Pass: 12345678");
        }
        // ------------------------------

        // Arrancar el servidor SOLO si la BD conecta
        httpServer.listen(3000, () => {
            console.log("Servidor corriendo en puerto 3000");
        });
    })
    .catch((error) => console.log("Error conectando a la BD: ", error));

app.set("socketio", io);

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/", routes);

