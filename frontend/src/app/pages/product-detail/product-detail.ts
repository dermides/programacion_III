import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Para leer la URL
import { ProductService } from '../../services/product';
import { Product } from '../../models';
import { environment } from '../../../environments/environment';
import { CurrencyPipe } from '@angular/common'; // CommonModule incluye *ngIf, *ngFor, etc.
import { NotificationService } from '../../services/notification';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private notification = inject(NotificationService);
  private cd = inject(ChangeDetectorRef);
  private cartService = inject(CartService);

  apiUrl = environment.apiUrl;

  product: Product | null = null;
  currentImage: string = ''; // La foto que se ve en grande
  loading = true;

  ngOnInit() {
    // 1. Obtener el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number) {
    this.productService.getOne(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;

        // Ponemos la primera imagen como activa por defecto
        if (data.images && data.images.length > 0) {
          this.currentImage = data.images[0].fileName;
        }

        this.cd.detectChanges();

      },
      error: () => {
        this.loading = false;
        this.notification.show('Producto no encontrado', 'is-danger');
      }
    });
  }

  // Función para cambiar la foto grande al hacer click en miniatura
  changeImage(fileName: string) {
    this.currentImage = fileName;
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.notification.show('Producto agregado', 'is-success');
    }
  }
}
