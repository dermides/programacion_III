import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configura tus credenciales en el archivo .env
const clientId = process.env.PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

// Elige el entorno: Sandbox (pruebas) o Live (producción)
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const environment = new paypal.core.LiveEnvironment(clientId, clientSecret); // Usar para prod

const client = new paypal.core.PayPalHttpClient(environment);

export default client;