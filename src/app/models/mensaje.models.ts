export interface Mensaje {
  id_mensaje: number;
  id_remitente: number;
  id_destinatario: number;
  id_veterinaria?: number | null;
  id_cita?: number | null;
  contenido: string;
  leido: boolean;
  fecha_envio?: string | null;
}

export interface MensajeCreate {
  id_destinatario: number;
  id_veterinaria?: number | null;
  id_cita?: number | null;
  contenido: string;
}