import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@service/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signal para el usuario
  private user = toSignal(this.authService.currentUser$);

  // Signal computado para el nombre
  userName = computed(() => {
    const u = this.user();
    return u ? u.email.split('@')[0] : 'Usuario';
  });

  // Signal computado para el rol
  userRole = computed(() => {
    const u = this.user();
    if (!u) return null;
    const roleId = Number(u.role_id);
    if (roleId === 1) return 'admin';
    if (roleId === 2) return 'proveedor';
    if (roleId === 3) return 'cliente';
    return null;
  });

  isMenuOpen: boolean = false; 

  constructor() {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    console.log('Ejecutando cierre de sesión...');
    this.authService.logout();
  }
}
