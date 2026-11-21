import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { VeterinariaService } from '../../services/veterinaria.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.models';
import { Veterinaria } from '../../models/veterinaria.models';

@Component({
  selector: 'app-productos',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './productos.html',
})
export class ProductosPage implements OnInit {
  private readonly svc = inject(ProductoService);
  private readonly vetSvc = inject(VeterinariaService);
  protected readonly auth = inject(AuthService);

  productos = signal<Producto[]>([]);
  veterinarias = signal<Veterinaria[]>([]);
  error = signal('');
  mensaje = signal('');

  nuevo = {
    id_veterinaria: null as number | null,
    nombre: '',
    descripcion: '',
    precio_compra: null as number | null,
    precio_venta: null as number | null,
    stock: 0,
  };

  ngOnInit(): void {
    this.cargar();
    this.vetSvc.listar().subscribe({ next: (l) => this.veterinarias.set(l) });
  }

  cargar(): void {
    this.svc.listarProductos().subscribe({
      next: (l) => this.productos.set(l),
      error: () => this.error.set('No se pudieron cargar los productos'),
    });
  }

  guardar(): void {
    this.error.set('');
    this.mensaje.set('');
    if (!this.nuevo.id_veterinaria || this.nuevo.precio_venta == null) {
      this.error.set('Elige la veterinaria y escribe el precio de venta');
      return;
    }
    this.svc.crearProducto({
      id_veterinaria: this.nuevo.id_veterinaria,
      nombre: this.nuevo.nombre,
      descripcion: this.nuevo.descripcion || null,
      precio_compra: this.nuevo.precio_compra,
      precio_venta: this.nuevo.precio_venta,
      stock: this.nuevo.stock,
    }).subscribe({
      next: () => {
        this.nuevo = { id_veterinaria: null, nombre: '', descripcion: '', precio_compra: null, precio_venta: null, stock: 0 };
        this.cargar();
      },
      error: (e) => this.error.set(this.texto(e, 'No se pudo crear el producto')),
    });
  }

  agregar(idProducto: number, cantidad: number): void {
    this.error.set('');
    this.mensaje.set('');
    this.svc.agregarAlCarrito(idProducto, cantidad).subscribe({
      next: () => this.mensaje.set('Producto agregado al carrito'),
      error: (e) => this.error.set(this.texto(e, 'No se pudo agregar al carrito')),
    });
  }

  nombreVeterinaria(id: number): string {
    return this.veterinarias().find((v) => v.id_veterinaria === id)?.nombre ?? `Veterinaria #${id}`;
  }

  private texto(e: any, porDefecto: string): string {
    const d = e?.error?.detail;
    return typeof d === 'string' ? d : porDefecto;
  }
}