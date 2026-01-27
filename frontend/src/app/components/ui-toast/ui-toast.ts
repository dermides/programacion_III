import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification';
// No necesitamos CommonModule gracias a la nueva sintaxis @for

@Component({
  selector: 'app-ui-toast',
  standalone: true,
  imports: [],
  templateUrl: './ui-toast.html',
  styleUrl: './ui-toast.scss'
})
export class UiToastComponent {
  notificationService = inject(NotificationService);
}
