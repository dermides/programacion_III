import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // <--- Importante
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification';
import { CommonModule } from '@angular/common'; // Para validar errores en el HTML

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule], // <--- Agregar imports
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  // Definimos el formulario y sus validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.notification.show('¡Bienvenido de nuevo!', 'is-success');
        this.router.navigate(['/']); // Ir al inicio
      },
      error: (err) => {
        // Mostramos el mensaje que viene del backend o uno genérico
        const msg = err.error?.message || 'Error al iniciar sesión';
        this.notification.show(msg, 'is-danger');
      }
    });
  }
}
