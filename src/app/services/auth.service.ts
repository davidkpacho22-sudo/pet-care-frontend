import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest, TokenResponse, UsuarioResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'peludos_token';

  // signal: la pantalla se actualiza sola cuando cambia
  private readonly logueado = signal(!!localStorage.getItem(this.tokenKey));

  register(data: RegisterRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/auth/register`, data);
  }

  login(correo: string, contrasena: string): Observable<TokenResponse> {
    // El backend usa OAuth2PasswordRequestForm: espera form-data con username/password
    const body = new HttpParams()
      .set('username', correo)
      .set('password', contrasena);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
      tap((res) => this.setToken(res.access_token))
    );
  }

  // Método añadido para obtener los datos del usuario autenticado
  me(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/usuarios/me`);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.logueado.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.logueado.set(false);
  }

  isLoggedIn(): boolean {
    return this.logueado();
  }
}