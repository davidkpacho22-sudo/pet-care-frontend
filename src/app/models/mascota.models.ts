export interface Mascota {
  id_mascota: number;
  id_usuario: number;
  nombre: string;
  especie: string;
  raza?: string | null;
  peso?: string | number | null; // el backend devuelve Decimal como texto
  fecha_nacimiento?: string | null;
  chip?: string | null;
  alergias?: string | null;
  condiciones_medicas?: string | null;
}

export interface MascotaCreate {
  nombre: string;
  especie: string;
  raza?: string | null;
  peso?: number | null;
  fecha_nacimiento?: string | null;
  chip?: string | null;
  alergias?: string | null;
  condiciones_medicas?: string | null;
}