import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { MyOrdersComponent } from './pages/my-orders/my-orders';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Ruta por defecto (Home)
  { path: '', component: ProductListComponent },

  // Ruta explícita
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  { path: 'my-orders', component: MyOrdersComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard] // <--- ¡El portero!
  },

  // Redirección por si escriben cualquier cosa
  { path: '**', redirectTo: '' }
];
