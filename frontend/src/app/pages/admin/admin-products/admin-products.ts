import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private notification = inject(NotificationService);

  products: Product[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    /*this.productService.getAll().subscribe(data => {
      this.products = data;
    });*/
    this.productService.getAll().subscribe((response: any) => this.products = response.data);
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.notification.show('Producto eliminado', 'is-success');
          // Recargamos la lista para que desaparezca
          this.loadProducts();
        },
        error: () => this.notification.show('Error al eliminar', 'is-danger')
      });
    }
  }
}
