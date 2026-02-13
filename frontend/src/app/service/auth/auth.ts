import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export type UserRole = 'cliente' | 'proveedor' | 'admin' | null;

export interface User {
  id: number;
  email: string;
  role_id: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentRoleSubject = new BehaviorSubject<UserRole>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
        this.updateRole(parsedUser.role_id);
      }
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.updateRole(response.user.role_id);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.currentRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUserRole(): UserRole {
    return this.currentRoleSubject.value;
  }

  // Helper to map role_id to string role
  private updateRole(roleId: number) {
    // Assuming 1: Admin, 2: Proveedor, 3: Cliente based on SQL implication or ensuring this map
    let role: UserRole = null;
    if (roleId === 2) role = 'proveedor';
    else if (roleId === 3) role = 'cliente';
    else if (roleId === 1) role = 'admin';

    this.currentRoleSubject.next(role);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}