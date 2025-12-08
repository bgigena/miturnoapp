// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';

export type UserRole = 'customer' | 'provider' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: esta información se obtendría después de un login exitoso,
  // probablemente decodificando un token JWT o consultando una API.
  private currentRole: UserRole = 'provider'; // <-- Cambia a 'customer' para probar la otra ruta

  constructor() { }

  /**
   * Devuelve el rol del usuario actual.
   */
  getUserRole(): UserRole {
    return this.currentRole;
  }
}