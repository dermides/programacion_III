import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  cartService = inject(CartService);
  apiUrl = environment.apiUrl;

  // Acciones simples que delegan al servicio
  increase(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty + 1);
  }

  decrease(id: number, qty: number) {
    this.cartService.updateQuantity(id, qty - 1);
  }

  remove(id: number) {
    this.cartService.removeFromCart(id);
  }
}
