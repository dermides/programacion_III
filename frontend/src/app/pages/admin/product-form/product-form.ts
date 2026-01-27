import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  isEditMode = false;
  productId: number | null = null;
  selectedFile: File | null = null;

  ngOnInit() {
    // Verificamos si hay un ID en la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number) {
    this.productService.getOne(id).subscribe(product => {
      // Llenamos el formulario con los datos existentes
      this.form.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    // Preparamos los datos como FormData (necesario para enviar archivos)
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value || '');
    formData.append('description', this.form.get('description')?.value || '');
    formData.append('price', String(this.form.get('price')?.value));
    formData.append('stock', String(this.form.get('stock')?.value));

    // Solo agregamos la imagen si el usuario seleccionó una nueva
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // 'image' debe coincidir con tu backend (upload.single('image'))
    }

    if (this.isEditMode && this.productId) {
      // EDITAR
      this.productService.update(this.productId, formData).subscribe({
        next: () => {
          this.notification.show('Producto actualizado', 'is-success');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.notification.show('Error al actualizar', 'is-danger')
      });
    } else {
      // CREAR
      this.productService.create(formData).subscribe({
        next: () => {
          this.notification.show('Producto creado', 'is-success');
          this.router.navigate(['/admin/products']);
        },
        error: () => this.notification.show('Error al crear', 'is-danger')
      });
    }
  }
}
