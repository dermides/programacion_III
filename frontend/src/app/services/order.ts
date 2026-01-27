import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createOrder(cartItems: CartItem[]) {
    // Transformamos el carrito complejo a un array simple para el backend:
    // De: [{ product: {id: 1, name...}, quantity: 2 }]
    // A:  { items: [{ productId: 1, quantity: 2 }] }

    const payload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    return this.http.post(`${this.apiUrl}/orders`, payload);
  }

  // Opcional: Para ver mis compras pasadas
  getMyOrders() {
    return this.http.get(`${this.apiUrl}/orders/my-orders`);
  }
}
