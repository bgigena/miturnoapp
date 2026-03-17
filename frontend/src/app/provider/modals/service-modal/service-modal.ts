import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

interface ServiceData {
  name: string;
  duration: number;
  price: number;
}

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './service-modal.html',
  styleUrl: './service-modal.css',  
})
export class ServiceModal {

  isModalVisible = input(false); 

  modalClosed = output<void>(); 
  serviceSaved = output<ServiceData>();
  
  service: ServiceData = { name: '', duration: 45, price: 10000 }; 

  closeModal(): void {
    this.modalClosed.emit();
  }

  saveService(): void {
    console.log('Servicio guardado (simulado):', this.service);
    this.serviceSaved.emit(this.service);
    this.closeModal(); 
  }
}
