import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { MascotasPage } from './pages/mascotas/mascotas';
import { VeterinariasPage } from './pages/veterinarias/veterinarias';
import { VeterinariaDetallePage } from './pages/veterinaria-detalle/veterinaria-detalle';
import { SaludPage } from './pages/salud/salud';
import { ProductosPage } from './pages/productos/productos';
import { CarritoPage } from './pages/carrito/carrito';
import { MensajesPage } from './pages/mensajes/mensajes';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegisterPage },
  { path: 'mascotas', component: MascotasPage, canActivate: [authGuard] },
  { path: 'veterinarias', component: VeterinariasPage },
  { path: 'veterinarias/:id', component: VeterinariaDetallePage },
  { path: 'salud', component: SaludPage, canActivate: [authGuard] },
  { path: 'productos', component: ProductosPage },
  { path: 'carrito', component: CarritoPage, canActivate: [authGuard] },
  { path: 'mensajes', component: MensajesPage, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];