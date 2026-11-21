import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Recordatorio, RecordatorioCreate,
  Medicamento, MedicamentoCreate,
  Vacuna, VacunaCreate,
} from '../models/salud.models';

@Injectable({ providedIn: 'root' })
export class SaludService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/recordatorios`;

  // Recordatorios
  listarRecordatorios(idMascota: number): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.url}/mascota/${idMascota}`);
  }
  crearRecordatorio(data: RecordatorioCreate): Observable<Recordatorio> {
    return this.http.post<Recordatorio>(`${this.url}/`, data);
  }
  marcarNotificado(id: number): Observable<Recordatorio> {
    return this.http.patch<Recordatorio>(`${this.url}/${id}`, { notificado: true });
  }
  eliminarRecordatorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Medicamentos
  listarMedicamentos(idMascota: number): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${this.url}/medicamentos/mascota/${idMascota}`);
  }
  crearMedicamento(data: MedicamentoCreate): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.url}/medicamentos`, data);
  }
  eliminarMedicamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/medicamentos/${id}`);
  }

  // Vacunas
  listarVacunas(idMascota: number): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.url}/vacunas/mascota/${idMascota}`);
  }
  crearVacuna(data: VacunaCreate): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.url}/vacunas`, data);
  }
  eliminarVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/vacunas/${id}`);
  }
}