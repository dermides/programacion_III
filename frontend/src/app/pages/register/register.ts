import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer'] // Por defecto cliente
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.notification.show('Cuenta creada con éxito. Ahora inicia sesión.', 'is-success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al registrarse';
        this.notification.show(msg, 'is-danger');
      }
    });
  }
}
