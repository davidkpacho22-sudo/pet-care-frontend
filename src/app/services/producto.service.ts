import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ProductoCreate, Carrito, Pedido, PedidoCreate } from '../models/producto.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // Productos
  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.api}/productos`);
  }
  crearProducto(data: ProductoCreate): Observable<Producto> {
    return this.http.post<Producto>(`${this.api}/productos`, data);
  }

  // Carrito (siempre es el del usuario con sesión)
  verCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.api}/carrito`);
  }
  agregarAlCarrito(idProducto: number, cantidad: number): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.api}/carrito/items`, { id_producto: idProducto, cantidad });
  }
  quitarDelCarrito(idDetalle: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.api}/carrito/items/${idDetalle}`);
  }

  // Pedidos
  crearPedido(data: PedidoCreate): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.api}/pedidos`, data);
  }
  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.api}/pedidos`);
  }
}