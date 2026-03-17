import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-booking-link-panel',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './booking-link-panel.html',
  styleUrl: './booking-link-panel.css',
})
export class BookingLinkPanel {
// Simulación del servicio de notificaciones que mostraría un toast o alerta
  private readonly notificationService = { 
    showSuccess: (message: string) => console.log(`[NOTIFICACIÓN ÉXITO]: ${message}`),
    showError: (message: string) => console.error(`[NOTIFICACIÓN ERROR]: ${message}`)
  };

  /**
   * Copia el texto del enlace de reserva al portapapeles del navegador.
   * @param link El texto del enlace a copiar.
   */
  async copiarEnlace(link: string): Promise<void> {
    // 1. Verificar si la API del portapapeles está disponible
    if (!navigator.clipboard) {
      this.notificationService.showError('La API del portapapeles no está disponible en este navegador.');
      return;
    }

    try {
      // 2. Escribir el texto al portapapeles
      await navigator.clipboard.writeText(link.trim()); 
      
      // 3. Notificar éxito
      this.notificationService.showSuccess('¡Enlace de reserva copiado al portapapeles!');
      
    } catch (err) {
      this.notificationService.showError('No se pudo copiar el enlace. Intenta manualmente.');
      console.error('Error al intentar copiar al portapapeles:', err);
    }
  }
}
