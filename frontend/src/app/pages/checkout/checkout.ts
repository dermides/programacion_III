import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  loading = false;

  ngOnInit() {
    // Si el carrito está vacío, no tiene sentido estar aquí
    if (this.cartService.totalItems() === 0) {
      this.router.navigate(['/']);
    }
  }

  processPayment() {
    // 1. Validar autenticación
    if (!this.authService.currentUserValue) {
      this.notification.show('Debes iniciar sesión para comprar', 'is-warning');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // 2. Enviar orden al backend
    this.orderService.createOrder(this.cartService.cartItems()).subscribe({
      next: () => {
        this.loading = false;
        // 3. Éxito: Limpiar carrito y redirigir
        this.cartService.clear();
        this.notification.show('¡Compra realizada con éxito!', 'is-success');
        this.router.navigate(['/']); // O a una página de "Mis Pedidos"
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.notification.show('Error al procesar la compra', 'is-danger');
      }
    });
  }
}
