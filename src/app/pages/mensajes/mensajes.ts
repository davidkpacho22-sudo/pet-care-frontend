import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajeService } from '../../services/mensaje.service';
import { AuthService } from '../../services/auth.service';
import { Mensaje } from '../../models/mensaje.models';

@Component({
  selector: 'app-mensajes',
  imports: [FormsModule, DatePipe],
  templateUrl: './mensajes.html',
})
export class MensajesPage implements OnInit {
  private readonly svc = inject(MensajeService);
  private readonly auth = inject(AuthService);

  miId = signal<number | null>(null);
  mensajes = signal<Mensaje[]>([]);
  idActivo = signal<number | null>(null); // usuario con quien tengo la conversación abierta
  error = signal('');

  idOtro: number | null = null;
  texto = '';

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (u) => this.miId.set(u.id_usuario),
      error: () => this.error.set('No se pudo cargar tu usuario'),
    });
  }

  abrir(): void {
    this.error.set('');
    if (!this.idOtro) {
      this.error.set('Escribe el ID del usuario');
      return;
    }
    this.idActivo.set(this.idOtro);
    this.cargar();
  }

  cargar(): void {
    this.svc.conversacion(this.idActivo()!).subscribe({
      next: (lista) => {
        this.mensajes.set(lista);
        // Los mensajes que me enviaron y no he leído, se marcan como leídos
        lista
          .filter((m) => m.id_destinatario === this.miId() && !m.leido)
          .forEach((m) => this.svc.marcarLeido(m.id_mensaje).subscribe());
      },
      error: (e) => this.error.set(this.mensajeError(e, 'No se pudo cargar la conversación')),
    });
  }

  enviar(): void {
    this.error.set('');
    if (!this.texto.trim()) return;
    this.svc.enviar({
      id_destinatario: this.idActivo()!,
      contenido: this.texto,
    }).subscribe({
      next: () => {
        this.texto = '';
        this.cargar();
      },
      error: (e) => this.error.set(this.mensajeError(e, 'No se pudo enviar el mensaje')),
    });
  }

  private mensajeError(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}