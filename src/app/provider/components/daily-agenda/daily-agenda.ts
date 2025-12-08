import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

// Definición de la estructura de un Turno
interface Appointment {
  id: number;
  time: string;
  client: string;
  service: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'available' | 'completed';
  details?: string;
}

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-agenda.html',
  styleUrl: './daily-agenda.css',
})
export class DailyAgenda {
// Usaremos signals para manejar el estado reactivo del componente
  currentDate = signal(new Date()); 
  
  // Datos simulados de la agenda diaria
  appointments = signal<Appointment[]>([
    {
      id: 1,
      time: '10:00 - 10:45',
      client: 'Juan Pérez',
      service: 'Corte Clásico',
      price: 10000,
      status: 'confirmed',
      details: 'Anticipo OK'
    },
    {
      id: 2,
      time: '11:00 - 12:00',
      client: 'Maria García',
      service: 'Tintura',
      price: 25000,
      status: 'cancelled',
      details: 'Cancelado hace 3hs.'
    },
    {
      id: 3,
      time: '12:00 - 13:30',
      client: 'Turno Disponible',
      service: '',
      price: 0,
      status: 'available',
      details: 'Clic para bloquear u ofrecer en la app.'
    },
    {
      id: 4,
      time: '14:00 - 15:00',
      client: 'Laura Fernández',
      service: 'Alisado Express',
      price: 30000,
      status: 'completed',
      details: '**PAGO LIBERADO.**'
    },
    // Añadir más turnos simulados para llenar el día...
  ]); // <--- La lista de objetos ahora está envuelta en signal<Appointment[]>(...)

  
  // Los siguientes getters acceden correctamente a los datos llamando al signal: appointments()
  get confirmedAppointmentsCount(): number {
    return this.appointments().filter(a => a.status === 'confirmed').length;
  }
  
  get totalAppointmentsCount(): number {
    return this.appointments().length;
  }

  // Lógica para navegación de fecha (solo simulación)
  navigateToDate(days: number): void {
    const newDate = this.currentDate();
    newDate.setDate(newDate.getDate() + days);
    this.currentDate.set(newDate);
    console.log('Cargando turnos para:', this.currentDate().toDateString());
    // Aquí iría la llamada al servicio para cargar la data de la nueva fecha
  }

  // Método para obtener clases dinámicas según el estado
  getAppointmentClasses(status: Appointment['status']): string {
    switch (status) {
      case 'confirmed':
        // Fondo verde claro para turnos confirmados
        return 'border-green-400 bg-green-50 text-green-900';
      case 'cancelled':
        // Fondo rosa/rojo claro para cancelados
        return 'border-red-400 bg-red-50 text-red-900';
      case 'available':
        // Fondo gris claro para espacios disponibles
        return 'border-gray-300 bg-gray-50 text-gray-700 hover:shadow-md';
      case 'completed':
        // Fondo gris sólido para completados
        return 'border-gray-400 bg-gray-200 text-gray-800';
      default:
        return 'border-gray-300 bg-white text-gray-900';
    }
  }
}
