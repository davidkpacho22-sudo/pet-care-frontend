import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Carrito, Pedido, Producto } from '../../models/producto.models';

@Component({
  selector: 'app-carrito',
  imports: [FormsModule, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './carrito.html',
})
export class CarritoPage implements OnInit {
  private readonly svc = inject(ProductoService);

  carrito = signal<Carrito | null>(null);
  productos = signal<Producto[]>([]);
  pedidos = signal<Pedido[]>([]);
  error = signal('');
  mensaje = signal('');

  pedido = { direccion_entrega: '', metodo_pago: '' };

  // Se recalcula solo cuando cambia el carrito
  total = computed(() =>
    (this.carrito()?.detalles ?? []).reduce(
      (suma, d) => suma + d.cantidad * Number(d.precio_unitario), 0
    )
  );

  ngOnInit(): void {
    this.svc.listarProductos().subscribe({ next: (l) => this.productos.set(l) });
    this.cargarCarrito();
    this.cargarPedidos();
  }

  cargarCarrito(): void {
    this.svc.verCarrito().subscribe({
      next: (c) => this.carrito.set(c),
      error: (e) => this.error.set(this.texto(e, 'No se pudo cargar el carrito')),
    });
  }

  cargarPedidos(): void {
    this.svc.listarPedidos().subscribe({
      next: (l) => this.pedidos.set(l),
      error: (e) => this.error.set(this.texto(e, 'No se pudieron cargar los pedidos')),
    });
  }

  quitar(idDetalle: number): void {
    this.error.set('');
    this.svc.quitarDelCarrito(idDetalle).subscribe({
      next: (c) => this.carrito.set(c),
      error: (e) => this.error.set(this.texto(e, 'No se pudo quitar el producto')),
    });
  }

  hacerPedido(): void {
    this.error.set('');
    this.mensaje.set('');
    const c = this.carrito();
    if (!c || c.detalles.length === 0) {
      this.error.set('Tu carrito está vacío');
      return;
    }
    this.svc.crearPedido({
      id_carrito: c.id_carrito,
      direccion_entrega: this.pedido.direccion_entrega,
      metodo_pago: this.pedido.metodo_pago || null,
    }).subscribe({
      next: () => {
        this.mensaje.set('Pedido realizado correctamente');
        this.pedido = { direccion_entrega: '', metodo_pago: '' };
        this.cargarCarrito();   // el backend entrega un carrito nuevo y vacío
        this.cargarPedidos();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo crear el pedido')),
    });
  }

  nombreProducto(id: number): string {
    return this.productos().find((p) => p.id_producto === id)?.nombre ?? `Producto #${id}`;
  }

  private texto(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}