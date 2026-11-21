export interface Resena {
  id_resena: number;
  id_usuario: number;
  id_veterinaria: number;
  id_pedido?: number | null;
  calificacion: number;
  comentario?: string | null;
  fecha_creacion?: string | null;
}

export interface ResenaCreate {
  id_veterinaria: number;
  id_pedido?: number | null;
  calificacion: number;
  comentario?: string | null;
}