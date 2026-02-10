import { Router } from "express";
import auth from "./auth";
import user from "./user";
import product from "./product";
import payment from "./payment";
import order from "./order";
import favorite from "./favorite";
import wallet from "./wallet";

const routes = Router();

app.get('/', (req, res) => {
  res.send('¡API del E-commerce funcionando perfectamente! 🚀');
});

// Definición de las URLs base por módulo
routes.use("/auth", auth);       // Rutas serán: /api/auth/...
routes.use("/users", user);      // Rutas serán: /api/users/...
routes.use("/products", product);// Rutas serán: /api/products/...
//routes.use("/payment", payment); // Rutas serán: /api/payment/...
routes.use("/orders", order);
routes.use("/payments", payment);
routes.use("/favorites", favorite);
routes.use("/wallet", wallet);

export default routes;