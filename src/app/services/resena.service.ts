import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Resena, ResenaCreate } from '../models/resena.models';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/resenas`;

  listarDeVeterinaria(idVeterinaria: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.url}/veterinaria/${idVeterinaria}`);
  }

  crear(data: ResenaCreate): Observable<Resena> {
    return this.http.post<Resena>(`${this.url}/`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}