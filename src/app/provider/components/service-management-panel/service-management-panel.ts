import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceModal } from '@provider/modals/service-modal/service-modal';

@Component({
  selector: 'app-service-management-panel',
  standalone: true,
  imports: [CommonModule,ServiceModal],
  templateUrl: './service-management-panel.html',
  styleUrl: './service-management-panel.css',
})
export class ServiceManagementPanel {
  
isServiceModalVisible: boolean = false;

  openServiceModal(): void {
    this.isServiceModalVisible = true;
    console.log('Modal de servicios visible.');
  }

  closeServiceModal(): void {
    this.isServiceModalVisible = false;
    console.log('Modal de servicios cerrado.');
  }

  handleServiceSaved(service: any): void {
    console.log('Nuevo servicio recibido del modal:', service);
    // Aquí implementarías la lógica para actualizar la lista de servicios.
  }
}
