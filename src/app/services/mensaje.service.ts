import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mensaje, MensajeCreate } from '../models/mensaje.models';

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mensajes`;

  enviar(data: MensajeCreate): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}/`, data);
  }

  conversacion(idOtroUsuario: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.url}/conversacion/${idOtroUsuario}`);
  }

  marcarLeido(idMensaje: number): Observable<Mensaje> {
    return this.http.patch<Mensaje>(`${this.url}/${idMensaje}/leido`, {});
  }
}