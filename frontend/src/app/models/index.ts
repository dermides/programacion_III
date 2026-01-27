export interface User {
  id: number;
  email: string;
  role: 'admin' | 'customer' | 'seller';
}

export interface ProductImage {
  id: number;
  fileName: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: ProductImage[]; // Array de imágenes
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Respuesta del Login
export interface AuthResponse {
  message: string;
  token: string;
  role: string;
  userId: number;
}
