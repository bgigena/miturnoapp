import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  userName: string = 'Barbería El Corte Perfecto'; 

  // Nueva propiedad para controlar la visibilidad del menú móvil
  isMenuOpen: boolean = false; 

  constructor() {}

  // Nuevo método para abrir/cerrar el menú móvil
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    console.log('Usuario cerrando sesión...');
    // Lógica real de logout
    this.router.navigate(['/login']); 
  }
}
