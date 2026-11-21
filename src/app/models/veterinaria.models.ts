export interface Veterinaria {
  id_veterinaria: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  calificacion_promedio?: string | number | null; // el backend manda Decimal como texto
}

export interface VeterinariaCreate {
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
}

export interface Profesional {
  id_profesional: number;
  id_veterinaria: number;
  nombre_completo: string;
  especialidad?: string | null;
  numero_registro?: string | null;
}

export interface ProfesionalCreate {
  id_veterinaria: number;
  nombre_completo: string;
  especialidad?: string | null;
  numero_registro?: string | null;
}

export interface Cita {
  id_cita: number;
  id_mascota: number;
  id_profesional: number;
  id_veterinaria: number;
  fecha: string;
  estado: string;
  motivo?: string | null;
}

export interface CitaCreate {
  id_mascota: number;
  id_profesional: number;
  id_veterinaria: number;
  fecha: string;
  motivo?: string | null;
}