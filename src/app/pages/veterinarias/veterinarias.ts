import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VeterinariaService } from '../../services/veterinaria.service';
import { AuthService } from '../../services/auth.service';
import { Veterinaria } from '../../models/veterinaria.models';

@Component({
  selector: 'app-veterinarias',
  imports: [FormsModule, RouterLink],
  templateUrl: './veterinarias.html',
  styleUrl: './veterinarias.css',
})
export class VeterinariasPage implements OnInit {
  private readonly svc = inject(VeterinariaService);
  protected readonly auth = inject(AuthService);

  veterinarias = signal<Veterinaria[]>([]);
  error = signal('');

  nueva = { nombre: '', direccion: '', telefono: '' };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.svc.listar().subscribe({
      next: (lista) => this.veterinarias.set(lista),
      error: () => this.error.set('No se pudieron cargar las veterinarias'),
    });
  }

  guardar(): void {
    this.error.set('');
    this.svc.crear({
      nombre: this.nueva.nombre,
      direccion: this.nueva.direccion || null,
      telefono: this.nueva.telefono || null,
    }).subscribe({
      next: () => {
        this.nueva = { nombre: '', direccion: '', telefono: '' };
        this.cargar();
      },
      error: (e) => {
        const d = e?.error?.detail;
        this.error.set(typeof d === 'string' ? d : 'No se pudo crear la veterinaria');
      },
    });
  }
}