import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 1. Admin (Panel privado -> Cliente)
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },

  // 2. Checkout (Proceso de compra -> Cliente)
  {
    path: 'checkout',
    renderMode: RenderMode.Client
  },

  // 3. --- NUEVA REGLA PARA EL ERROR ---
  // Detalle de producto (Dinámico -> Cliente)
  {
    path: 'products/:id',
    renderMode: RenderMode.Client
  },

  // 4. Mis Pedidos (Privado -> Cliente)
  {
    path: 'my-orders',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
