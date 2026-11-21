export interface Recordatorio {
  id_recordatorio: number;
  id_mascota: number;
  tipo: string;
  descripcion?: string | null;
  fecha_programada: string;
  frecuencia?: string | null;
  notificado: boolean;
}

export interface RecordatorioCreate {
  id_mascota: number;
  tipo: string;
  descripcion?: string | null;
  fecha_programada: string;
  frecuencia?: string | null;
}

export interface Medicamento {
  id_medicamento: number;
  id_mascota: number;
  nombre: string;
  dosis?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  observaciones?: string | null;
}

export interface MedicamentoCreate {
  id_mascota: number;
  nombre: string;
  dosis?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  observaciones?: string | null;
}

export interface Vacuna {
  id_vacuna: number;
  id_mascota: number;
  nombre: string;
  fecha_aplicacion?: string | null;
  fecha_proxima_dosis?: string | null;
  observaciones?: string | null;
}

export interface VacunaCreate {
  id_mascota: number;
  nombre: string;
  fecha_aplicacion?: string | null;
  fecha_proxima_dosis?: string | null;
  observaciones?: string | null;
}