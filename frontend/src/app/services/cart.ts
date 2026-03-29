import { Injectable, signal, computed, inject, PLATFORM_ID, effect } from '@angular/core';
import { Product, CartItem } from '../models';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  // 1. Estado Reactivo: Lista de ítems
  cartItems = signal<CartItem[]>([]);

  // 2. Valores Computados (Se actualizan solos si cambia la lista)
  totalItems = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  constructor() {
    // Cargar del localStorage al iniciar (solo en navegador)
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        this.cartItems.set(JSON.parse(saved));
      }

      // Guardar en localStorage cada vez que cambie el carrito
      // 'effect' vigila los signals y ejecuta código cuando cambian
      effect(() => {
        localStorage.setItem('cart', JSON.stringify(this.cartItems()));
      });
    }
  }

  // Agregar producto
  addToCart(product: Product) {
    const current = this.cartItems();
    const existingIndex = current.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      // Si ya existe, aumentamos cantidad (inmutable)
      const updated = [...current];
      updated[existingIndex].quantity++;
      this.cartItems.set(updated);
    } else {
      // Si es nuevo, lo agregamos
      this.cartItems.set([...current, { product, quantity: 1 }]);
    }
  }

  // Quitar un ítem completo
  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  // Cambiar cantidad (+/-)
  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  // Limpiar todo (al comprar o salir)
  clear() {
    this.cartItems.set([]);
  }

  getPayPalClientId() {
    // Asumiendo que tu backend está en localhost:3000/api
    return this.http.get<{ clientId: string }>(`${environment.apiUrl}/config/paypal`);

  }


}
