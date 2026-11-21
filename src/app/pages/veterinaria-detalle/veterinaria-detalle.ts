import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VeterinariaService } from '../../services/veterinaria.service';
import { MascotaService } from '../../services/mascota.service';
import { AuthService } from '../../services/auth.service';
import { Veterinaria, Profesional, Cita } from '../../models/veterinaria.models';
import { Mascota } from '../../models/mascota.models';
import { ResenasComponent } from '../../components/resenas/resenas';

@Component({
  selector: 'app-veterinaria-detalle',
  imports: [FormsModule, RouterLink, DatePipe, ResenasComponent],
  templateUrl: './veterinaria-detalle.html',
  styleUrl: './veterinaria-detalle.css',
})
export class VeterinariaDetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(VeterinariaService);
  private readonly mascotaSvc = inject(MascotaService);
  protected readonly auth = inject(AuthService);

  // El id viene de la URL: /veterinarias/:id
  idVet = Number(this.route.snapshot.paramMap.get('id'));

  veterinaria = signal<Veterinaria | null>(null);
  profesionales = signal<Profesional[]>([]);
  mascotas = signal<Mascota[]>([]);
  citas = signal<Cita[]>([]);
  error = signal('');
  mensaje = signal('');

  nuevoProf = { nombre_completo: '', especialidad: '', numero_registro: '' };
  cita = { id_mascota: null as number | null, id_profesional: null as number | null, fecha: '', motivo: '' };
  mascotaVista: number | null = null;

  ngOnInit(): void {
    this.recargarVeterinaria();
    this.cargarProfesionales();
    if (this.auth.isLoggedIn()) {
      this.mascotaSvc.listar().subscribe({
        next: (lista) => this.mascotas.set(lista),
      });
    }
  }

  recargarVeterinaria(): void {
    this.svc.obtener(this.idVet).subscribe({
      next: (v) => this.veterinaria.set(v),
      error: () => this.error.set('Veterinaria no encontrada'),
    });
  }

  cargarProfesionales(): void {
    this.svc.listarProfesionales(this.idVet).subscribe({
      next: (lista) => this.profesionales.set(lista),
    });
  }

  guardarProfesional(): void {
    this.error.set('');
    this.svc.crearProfesional({
      id_veterinaria: this.idVet,
      nombre_completo: this.nuevoProf.nombre_completo,
      especialidad: this.nuevoProf.especialidad || null,
      numero_registro: this.nuevoProf.numero_registro || null,
    }).subscribe({
      next: () => {
        this.nuevoProf = { nombre_completo: '', especialidad: '', numero_registro: '' };
        this.cargarProfesionales();
      },
      error: (e) => this.error.set(this.textoError(e, 'No se pudo crear el profesional')),
    });
  }

  agendar(): void {
    this.error.set('');
    this.mensaje.set('');
    if (!this.cita.id_mascota || !this.cita.id_profesional || !this.cita.fecha) {
      this.error.set('Elige mascota, profesional y fecha');
      return;
    }
    this.svc.crearCita({
      id_mascota: this.cita.id_mascota,
      id_profesional: this.cita.id_profesional,
      id_veterinaria: this.idVet,
      fecha: this.cita.fecha,
      motivo: this.cita.motivo || null,
    }).subscribe({
      next: () => {
        this.mensaje.set('Cita agendada correctamente');
        this.mascotaVista = this.cita.id_mascota;
        this.verCitas(this.mascotaVista);
        this.cita = { id_mascota: null, id_profesional: null, fecha: '', motivo: '' };
      },
      error: (e) => this.error.set(this.textoError(e, 'No se pudo agendar la cita')),
    });
  }

  verCitas(idMascota: number | null): void {
    if (!idMascota) {
      this.citas.set([]);
      return;
    }
    this.svc.citasDeMascota(idMascota).subscribe({
      // Solo mostramos las citas de esta veterinaria
      next: (lista) => this.citas.set(lista.filter((c) => c.id_veterinaria === this.idVet)),
      error: (e) => this.error.set(this.textoError(e, 'No se pudieron cargar las citas')),
    });
  }

  cancelar(idCita: number): void {
    if (!confirm('¿Cancelar esta cita?')) return;
    this.svc.eliminarCita(idCita).subscribe({
      next: () => this.verCitas(this.mascotaVista),
      error: (e) => this.error.set(this.textoError(e, 'No se pudo cancelar la cita')),
    });
  }

  nombreProfesional(id: number): string {
    return this.profesionales().find((p) => p.id_profesional === id)?.nombre_completo ?? `Profesional #${id}`;
  }

  private textoError(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}