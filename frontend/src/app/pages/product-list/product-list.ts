import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product';
import { AsyncPipe, CurrencyPipe } from '@angular/common'; // Pipes para HTML
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent {
  private productService = inject(ProductService);

  // Observable que trae los productos automáticamente
  products$ = this.productService.getAll();

  // Para construir la URL de la imagen
  apiUrl = environment.apiUrl;
}
