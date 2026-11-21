export interface RegisterRequest {
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
  telefono?: string;
  direccion?: string;
}

export interface UsuarioResponse {
  id_usuario: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono?: string | null;
  direccion?: string | null;
  rol: string;
  activo: boolean;
  fecha_registro: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
