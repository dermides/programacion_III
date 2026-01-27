import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { User } from '../../models';
import { CommonModule } from '@angular/common'; // Importante para *ngIf
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importar módulos necesarios
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  user: User | null = null;

  constructor() {
    // Nos suscribimos para saber si el usuario cambia (login/logout)
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  logout() {
    this.authService.logout();
    this.cartService.clear();
  }
}
