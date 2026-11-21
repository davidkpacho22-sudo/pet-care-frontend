import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  form: RegisterRequest = {
    nombre_completo: '',
    correo_electronico: '',
    contrasena: '',
    telefono: '',
    direccion: '',
  };

  cargando = false;
  error = '';
  exito = '';

  onSubmit(): void {
    this.error = '';
    this.exito = '';
    this.cargando = true;
    const payload: RegisterRequest = {
      nombre_completo: this.form.nombre_completo,
      correo_electronico: this.form.correo_electronico,
      contrasena: this.form.contrasena,
      ...(this.form.telefono ? { telefono: this.form.telefono } : {}),
      ...(this.form.direccion ? { direccion: this.form.direccion } : {}),
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'No se pudo registrar. Intenta de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }
}