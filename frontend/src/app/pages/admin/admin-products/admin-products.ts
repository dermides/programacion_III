import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { NotificationService } from '../../../services/notification';
import { signal } from '@angular/core'; // Importar signal

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

  //products: Product[] = [];
  products = signal<Product[]>([]);
  allProducts= signal<Product[]>([]);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    /*this.productService.getAll().subscribe(data => {
      this.products = data;
    });*/
    //this.productService.getAll().subscribe((response: any) => this.products = response.data);
    // Cambiamos el tipo a 'any' temporalmente para evitar que TypeScript se queje
    this.productService.getAll().subscribe({
    next: (data) => {
      this.allProducts.set(data);
      this.products.set(data);

    }
  });
  }

  filterProducts(event: any) {
  const query = event.target.value.toLowerCase(); // Lo que escribió el usuario

  if (!query) {
    // Si borró todo, volvemos a mostrar la lista original completa
    this.products.set(this.allProducts());
    return;
  }

  // Filtramos por ID (o por nombre si quieres también)
  this.products.set(this.allProducts().filter(product => {
    // Convertimos el ID a string para poder buscar
    const idCoincide = product.id.toString().includes(query);
    const nombreCoincide = product.name.toLowerCase().includes(query);

    // Retorna TRUE si coincide el ID o el Nombre
    return idCoincide || nombreCoincide;
  }));
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
