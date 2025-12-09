import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ServiceData {
  name: string;
  duration: number;
  price: number;
}

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-modal.html',
  styleUrl: './service-modal.css',  
})
export class ServiceModal {

  isModalVisible = input(false); 

  modalClosed = output<void>(); // Se especifica el tipo de dato entre corchetes <>
  serviceSaved = output<ServiceData>();
  
  service: ServiceData = { name: '', duration: 0, price: 0 }; 

  closeModal(): void {
    // Para emitir, simplemente llamamos al método .emit() del Output signal.
    this.modalClosed.emit();
  }

  saveService(): void {
    console.log('Servicio guardado (simulado):', this.service);
    
    // Emitimos los datos del servicio guardado
    this.serviceSaved.emit(this.service);
    this.closeModal(); 
  }
}
