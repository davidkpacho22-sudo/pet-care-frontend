import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';
import { Resena } from '../../models/resena.models';

@Component({
  selector: 'app-resenas',
  imports: [FormsModule, DatePipe],
  templateUrl: './resenas.html',
})
export class ResenasComponent implements OnInit {
  private readonly svc = inject(ResenaService);
  protected readonly auth = inject(AuthService);

  // Lo recibe de la pantalla de detalle: <app-resenas [idVeterinaria]="idVet" />
  idVeterinaria = input.required<number>();
  // Avisa a la pantalla de detalle para que actualice el promedio
  cambio = output<void>();

  resenas = signal<Resena[]>([]);
  miId = signal<number | null>(null);
  error = signal('');

  nueva = { calificacion: 5, comentario: '' };

  ngOnInit(): void {
    this.cargar();
    if (this.auth.isLoggedIn()) {
      this.auth.me().subscribe({ next: (u) => this.miId.set(u.id_usuario) });
    }
  }

  cargar(): void {
    this.svc.listarDeVeterinaria(this.idVeterinaria()).subscribe({
      next: (l) => this.resenas.set(l),
      error: (e) => this.error.set(this.texto(e, 'No se pudieron cargar las reseñas')),
    });
  }

  guardar(): void {
    this.error.set('');
    this.svc.crear({
      id_veterinaria: this.idVeterinaria(),
      calificacion: Number(this.nueva.calificacion),
      comentario: this.nueva.comentario || null,
    }).subscribe({
      next: () => {
        this.nueva = { calificacion: 5, comentario: '' };
        this.cargar();
        this.cambio.emit();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo publicar la reseña')),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar tu reseña?')) return;
    this.svc.eliminar(id).subscribe({
      next: () => {
        this.cargar();
        this.cambio.emit();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo eliminar')),
    });
  }

  estrellas(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  private texto(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}