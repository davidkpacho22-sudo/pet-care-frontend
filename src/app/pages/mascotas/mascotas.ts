import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../models/mascota.models';

@Component({
  selector: 'app-mascotas',
  imports: [FormsModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class MascotasPage implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  // Con signal la pantalla se actualiza sola cuando cambia el valor
  mascotas = signal<Mascota[]>([]);
  error = signal('');

  nueva = {
    nombre: '',
    especie: '',
    raza: '',
    peso: null as number | null,
    fecha_nacimiento: '',
    chip: '',
    alergias: '',
    condiciones_medicas: '',
  };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.mascotaService.listar().subscribe({
      next: (lista) => this.mascotas.set(lista),
      error: (e) => this.error.set(e.error?.detail ?? 'No se pudieron cargar las mascotas'),
    });
  }

  guardar(): void {
    this.error.set('');
    // Los campos vacíos se mandan como null (el chip es único, un texto vacío chocaría)
    const datos = {
      nombre: this.nueva.nombre,
      especie: this.nueva.especie,
      raza: this.nueva.raza || null,
      peso: this.nueva.peso,
      fecha_nacimiento: this.nueva.fecha_nacimiento || null,
      chip: this.nueva.chip || null,
      alergias: this.nueva.alergias || null,
      condiciones_medicas: this.nueva.condiciones_medicas || null,
    };
    this.mascotaService.crear(datos).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargar();
      },
      error: (e) => this.error.set(e.error?.detail ?? 'No se pudo guardar la mascota'),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta mascota?')) return;
    this.mascotaService.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.error?.detail ?? 'No se pudo eliminar'),
    });
  }

  private limpiarFormulario(): void {
    this.nueva = {
      nombre: '', especie: '', raza: '', peso: null,
      fecha_nacimiento: '', chip: '', alergias: '', condiciones_medicas: '',
    };
  }
}