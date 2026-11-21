import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mascota, MascotaCreate } from '../models/mascota.models';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/mascotas/`;

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.url);
  }

  crear(data: MascotaCreate): Observable<Mascota> {
    return this.http.post<Mascota>(this.url, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}`);
  }
}