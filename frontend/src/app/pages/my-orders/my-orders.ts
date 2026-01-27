import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'; // Pipes para formato
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: any[] = [];
  loading = true;

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
