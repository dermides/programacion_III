import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, NgxPayPalModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  loading = false;

  payPalConfig?: IPayPalConfig;
  clientId: string = ''; // Variable para guardar la llave
  isProcessing: boolean = false;
  total: any;
  items: import("../../models").CartItem[] = [];

  ngOnInit() {
    // 1. Cargar datos del servicio
    this.items = this.cartService.cartItems();
    this.total = this.cartService.totalItems();
    // Si el carrito está vacío, no tiene sentido estar aquí
    if (this.cartService.totalItems() === 0) {
      this.router.navigate(['/']);
    }

    // 2. 👇 PRIMERO PEDIMOS LA LLAVE AL BACKEND
    this.cartService.getPayPalClientId().subscribe({
      next: (response: { clientId: string; }) => {
        this.clientId = response.clientId;
        console.log('Llave recibida:', this.clientId);

        // 3. UNA VEZ QUE TENEMOS LA LLAVE, INICIAMOS PAYPAL
        this.initConfig();
      },
      error: (err: any) => {
        console.error('Error al obtener llave de PayPal', err);
        this.notification.show('Error al configurar PayPal', 'is-danger');
      }
    });

    //this.initConfig();

  }


  private initConfig(): void {
    const totalStr = this.total.toFixed(2); // Formato "100.00"

    this.payPalConfig = {
      currency: 'USD',
      clientId: this.clientId,

      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: totalStr,
            breakdown: {
              item_total: { currency_code: 'USD', value: totalStr }
            }
          }
        }]
      },
      advanced: { commit: 'true' },
      style: { label: 'paypal', layout: 'vertical' },


      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          console.log('Pago aprobado:', details);
          this.procesarOrdenBackend(details);
        });
      },


      onError: err => {
        console.log(err);
        this.notification.show('Error al procesar el pago', 'is-danger');
      }
    };
  }

  // 🚀 ESTO SE EJECUTA CUANDO PAYPAL YA COBRÓ
  procesarOrdenBackend(paymentDetails: any) {
    this.isProcessing = true;

    // Aquí podrías tener un endpoint específico "createOrder" en tu backend.
    // Como ejemplo, voy a descontar el stock de cada producto uno por uno:

    // (Opcional) Guardar la orden en BD:
    // this.orderService.createOrder({ items: this.items, paymentId: paymentDetails.id })...

    // Simulamos éxito y limpiamos:
    setTimeout(() => {
      this.cartService.clear();
      this.isProcessing = false;

      this.notification.show('¡Compra realizada con éxito!', 'is-success');
      this.router.navigate(['/']);
    }, 2000);
  }


  processPayment() {
    // 1. Validar autenticación
    if (!this.authService.currentUserValue) {
      this.notification.show('Debes iniciar sesión para comprar', 'is-warning');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    // 2. Enviar orden al backend
    this.orderService.createOrder(this.cartService.cartItems()).subscribe({
      next: () => {
        this.loading = false;
        // 3. Éxito: Limpiar carrito y redirigir
        this.cartService.clear();
        this.notification.show('¡Compra realizada con éxito!', 'is-success');
        this.router.navigate(['/']); // O a una página de "Mis Pedidos"
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.notification.show('Error al procesar la compra', 'is-danger');
      }
    });
  }
}
