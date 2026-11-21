import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  correo = '';
  contrasena = '';
  cargando = false;
  error = '';
  exito = '';

  onSubmit(): void {
    this.error = '';
    this.exito = '';
    this.cargando = true;
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = 'Inicio de sesión exitoso.';
        this.cdr.markForCheck();
        this.router.navigateByUrl('/mascotas');
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'No se pudo iniciar sesión. Verifica tus datos.';
        this.cdr.markForCheck();
      },
    });
  }
}