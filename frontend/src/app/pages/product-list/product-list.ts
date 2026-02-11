import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product';
import { AsyncPipe, CurrencyPipe } from '@angular/common'; // Pipes para HTML
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { Product } from '../../models';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notification = inject(NotificationService);

  // Observable que trae los productos automáticamente
  products$ = this.productService.getAll();

  // Para construir la URL de la imagen
  apiUrl = environment.apiUrl;

  product: Product | null = null;
  currentImage: string = ''; // La foto que se ve en grande
  loading = true;

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.notification.show('Producto agregado', 'is-success');
    }
  }
}
