export interface Producto {
  id_producto: number;
  id_veterinaria: number;
  nombre: string;
  descripcion?: string | null;
  precio_compra?: string | number | null;
  precio_venta: string | number; // el backend manda Decimal como texto
  stock: number;
}

export interface ProductoCreate {
  id_veterinaria: number;
  nombre: string;
  descripcion?: string | null;
  precio_compra?: number | null;
  precio_venta: number;
  stock: number;
}

export interface DetalleCarrito {
  id_detalle: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: string | number;
}

export interface Carrito {
  id_carrito: number;
  id_usuario: number;
  detalles: DetalleCarrito[];
}

export interface PedidoCreate {
  id_carrito: number;
  direccion_entrega: string;
  metodo_pago?: string | null;
}

export interface Pedido {
  id_pedido: number;
  id_carrito: number;
  direccion_entrega: string;
  estado: string;
  metodo_pago?: string | null;
  total: string | number;
  fecha_creacion?: string | null;
}