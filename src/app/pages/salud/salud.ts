import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SaludService } from '../../services/salud.service';
import { MascotaService } from '../../services/mascota.service';
import { Mascota } from '../../models/mascota.models';
import { Recordatorio, Medicamento, Vacuna } from '../../models/salud.models';

@Component({
  selector: 'app-salud',
  imports: [FormsModule, RouterLink],
  templateUrl: './salud.html',
})
export class SaludPage implements OnInit {
  private readonly svc = inject(SaludService);
  private readonly mascotaSvc = inject(MascotaService);

  mascotas = signal<Mascota[]>([]);
  recordatorios = signal<Recordatorio[]>([]);
  medicamentos = signal<Medicamento[]>([]);
  vacunas = signal<Vacuna[]>([]);
  error = signal('');

  idMascota: number | null = null;

  nuevoRec = { tipo: '', descripcion: '', fecha_programada: '', frecuencia: '' };
  nuevoMed = { nombre: '', dosis: '', fecha_inicio: '', fecha_fin: '', observaciones: '' };
  nuevaVac = { nombre: '', fecha_aplicacion: '', fecha_proxima_dosis: '', observaciones: '' };

  ngOnInit(): void {
    this.mascotaSvc.listar().subscribe({
      next: (lista) => this.mascotas.set(lista),
      error: () => this.error.set('No se pudieron cargar tus mascotas'),
    });
  }

  // Se ejecuta al elegir una mascota: carga sus tres listas
  cambiarMascota(id: number | null): void {
    this.idMascota = id;
    this.error.set('');
    if (!id) {
      this.recordatorios.set([]);
      this.medicamentos.set([]);
      this.vacunas.set([]);
      return;
    }
    this.cargarRecordatorios();
    this.cargarMedicamentos();
    this.cargarVacunas();
  }

  cargarRecordatorios(): void {
    this.svc.listarRecordatorios(this.idMascota!).subscribe({
      next: (l) => this.recordatorios.set(l),
      error: (e) => this.error.set(this.texto(e, 'No se pudieron cargar los recordatorios')),
    });
  }
  cargarMedicamentos(): void {
    this.svc.listarMedicamentos(this.idMascota!).subscribe({
      next: (l) => this.medicamentos.set(l),
      error: (e) => this.error.set(this.texto(e, 'No se pudieron cargar los medicamentos')),
    });
  }
  cargarVacunas(): void {
    this.svc.listarVacunas(this.idMascota!).subscribe({
      next: (l) => this.vacunas.set(l),
      error: (e) => this.error.set(this.texto(e, 'No se pudieron cargar las vacunas')),
    });
  }

  // ---------- Recordatorios ----------
  guardarRecordatorio(): void {
    this.error.set('');
    this.svc.crearRecordatorio({
      id_mascota: this.idMascota!,
      tipo: this.nuevoRec.tipo,
      descripcion: this.nuevoRec.descripcion || null,
      fecha_programada: this.nuevoRec.fecha_programada,
      frecuencia: this.nuevoRec.frecuencia || null,
    }).subscribe({
      next: () => {
        this.nuevoRec = { tipo: '', descripcion: '', fecha_programada: '', frecuencia: '' };
        this.cargarRecordatorios();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo crear el recordatorio')),
    });
  }
  marcarHecho(id: number): void {
    this.svc.marcarNotificado(id).subscribe({
      next: () => this.cargarRecordatorios(),
      error: (e) => this.error.set(this.texto(e, 'No se pudo actualizar')),
    });
  }
  borrarRecordatorio(id: number): void {
    if (!confirm('¿Eliminar este recordatorio?')) return;
    this.svc.eliminarRecordatorio(id).subscribe({
      next: () => this.cargarRecordatorios(),
      error: (e) => this.error.set(this.texto(e, 'No se pudo eliminar')),
    });
  }

  // ---------- Medicamentos ----------
  guardarMedicamento(): void {
    this.error.set('');
    this.svc.crearMedicamento({
      id_mascota: this.idMascota!,
      nombre: this.nuevoMed.nombre,
      dosis: this.nuevoMed.dosis || null,
      fecha_inicio: this.nuevoMed.fecha_inicio || null,
      fecha_fin: this.nuevoMed.fecha_fin || null,
      observaciones: this.nuevoMed.observaciones || null,
    }).subscribe({
      next: () => {
        this.nuevoMed = { nombre: '', dosis: '', fecha_inicio: '', fecha_fin: '', observaciones: '' };
        this.cargarMedicamentos();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo crear el medicamento')),
    });
  }
  borrarMedicamento(id: number): void {
    if (!confirm('¿Eliminar este medicamento?')) return;
    this.svc.eliminarMedicamento(id).subscribe({
      next: () => this.cargarMedicamentos(),
      error: (e) => this.error.set(this.texto(e, 'No se pudo eliminar')),
    });
  }

  // ---------- Vacunas ----------
  guardarVacuna(): void {
    this.error.set('');
    this.svc.crearVacuna({
      id_mascota: this.idMascota!,
      nombre: this.nuevaVac.nombre,
      fecha_aplicacion: this.nuevaVac.fecha_aplicacion || null,
      fecha_proxima_dosis: this.nuevaVac.fecha_proxima_dosis || null,
      observaciones: this.nuevaVac.observaciones || null,
    }).subscribe({
      next: () => {
        this.nuevaVac = { nombre: '', fecha_aplicacion: '', fecha_proxima_dosis: '', observaciones: '' };
        this.cargarVacunas();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo crear la vacuna')),
    });
  }
  borrarVacuna(id: number): void {
    if (!confirm('¿Eliminar esta vacuna?')) return;
    this.svc.eliminarVacuna(id).subscribe({
      next: () => this.cargarVacunas(),
      error: (e) => this.error.set(this.texto(e, 'No se pudo eliminar')),
    });
  }

  private texto(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}