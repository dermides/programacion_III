import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes"; // Importamos el índice de rutas

const app = express();

// --- 1. MIDDLEWARES DE SEGURIDAD Y UTILIDAD ---

// Helmet: Añade cabeceras HTTP de seguridad (Anti XSS, etc.)
app.use(helmet());

// CORS: Permite que Angular (Puerto 4200) hable con Node (Puerto 3000)
app.use(cors({
  origin: 'http://localhost:4200', // URL de tu frontend
  credentials: true, // ¡CRUCIAL! Permite el paso de Cookies (Auth)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Morgan: Loguea las peticiones en consola (útil en desarrollo)
app.use(morgan("dev"));

// Cookie Parser: Para leer la cookie 'auth_token'
app.use(cookieParser());

// Body Parser: Para entender JSON en el body de los POST
app.use(express.json());


// --- 2. RUTAS ---

// Prefijo global '/api'. Ej: http://localhost:3000/api/auth/login
app.use("/api", routes);


// --- 3. MANEJO DE ERRORES GLOBAL (Opcional pero recomendado) ---
// Si algo falla y no se captura antes, cae aquí.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// --- 4. CARPETA PÚBLICA (Para imágenes de productos) ---
app.use('/uploads', express.static('uploads'));

export default app;