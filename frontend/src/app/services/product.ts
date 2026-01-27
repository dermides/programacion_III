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
}
