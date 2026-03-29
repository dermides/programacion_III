import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll() {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getOne(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Crear (Usa FormData para poder enviar archivos/fotos)
  create(productData: FormData) {
    return this.http.post(`${this.apiUrl}/products`, productData);
  }

  // Editar
  /*update(id: number, productData: FormData) {
    // Usamos PATCH para actualizar parcialmente
    return this.http.patch(`${this.apiUrl}/products/${id}`, productData);
  }*/

  // En product.service.ts
  update(id: number, productData: any) { // Cambia FormData por 'any' o Product
    // Asegúrate de enviar JSON si tu backend no tiene Multer configurado aún
    return this.http.put(`${this.apiUrl}/products/${id}`, productData);
  }

  // Borrar
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}


