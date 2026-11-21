import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Veterinaria, VeterinariaCreate,
  Profesional, ProfesionalCreate,
  Cita, CitaCreate,
} from '../models/veterinaria.models';

@Injectable({ providedIn: 'root' })
export class VeterinariaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/veterinarias`;

  // Veterinarias
  listar(): Observable<Veterinaria[]> {
    return this.http.get<Veterinaria[]>(`${this.url}/`);
  }

  obtener(id: number): Observable<Veterinaria> {
    return this.http.get<Veterinaria>(`${this.url}/${id}`);
  }

  crear(data: VeterinariaCreate): Observable<Veterinaria> {
    return this.http.post<Veterinaria>(`${this.url}/`, data);
  }

  // Profesionales
  listarProfesionales(idVeterinaria: number): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.url}/${idVeterinaria}/profesionales`);
  }

  crearProfesional(data: ProfesionalCreate): Observable<Profesional> {
    return this.http.post<Profesional>(`${this.url}/${data.id_veterinaria}/profesionales`, data);
  }

  // Citas
  citasDeMascota(idMascota: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.url}/citas/mascota/${idMascota}`);
  }

  crearCita(data: CitaCreate): Observable<Cita> {
    return this.http.post<Cita>(`${this.url}/citas`, data);
  }

  eliminarCita(idCita: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/citas/${idCita}`);
  }
}