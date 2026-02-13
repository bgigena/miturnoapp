import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { AppointmentService, Appointment as BackendAppointment } from '../../../service/appointment.service';
import { format } from 'date-fns';

// Definición de la estructura de un Turno (Mapped for UI)
interface AppointmentUI {
  id: number;
  time: string;
  client: string;
  service: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'available' | 'completed' | 'pending';
  details?: string;
}

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-agenda.html',
  styleUrl: './daily-agenda.css',
})
export class DailyAgenda implements OnInit {
  private appointmentService = inject(AppointmentService);

  // Usaremos signals para manejar el estado reactivo del componente
  currentDate = signal(new Date());

  appointments = signal<AppointmentUI[]>([]);

  constructor() {
    // Effect to reload appointments when date changes
    effect(() => {
      this.loadAppointments(this.currentDate());
    });
  }

  ngOnInit() {
    // Initial load handled by effect or manual call if needed, 
    // but effect runs once on creation usually. 
    // Let's rely on effect or call it explicitly if effect doesn't trigger immediately.
  }

  loadAppointments(date: Date) {
    const dateString = format(date, 'yyyy-MM-dd');
    this.appointmentService.getAppointments(dateString).subscribe({
      next: (data) => {
        const mapped: AppointmentUI[] = data.map(app => ({
          id: app.id,
          time: `${format(new Date(app.fecha_hora_inicio), 'HH:mm')} - ${format(new Date(app.fecha_hora_fin), 'HH:mm')}`,
          client: `${app.cliente_nombre || ''} ${app.cliente_apellido || ''}`.trim(),
          service: app.servicio_nombre || 'Servicio',
          price: 0, // Backend doesn't return price on appointment yet, maybe add to backend query or ignore
          status: this.mapStatus(app.estado),
          details: app.notas
        }));
        this.appointments.set(mapped);
      },
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  mapStatus(backendStatus: string): AppointmentUI['status'] {
    switch (backendStatus) {
      case 'CONFIRMADO': return 'confirmed';
      case 'CANCELADO': return 'cancelled';
      case 'COMPLETADO': return 'completed';
      case 'PENDIENTE': return 'pending';
      default: return 'available'; // Fallback
    }
  }


  // Los siguientes getters acceden correctamente a los datos llamando al signal: appointments()
  get confirmedAppointmentsCount(): number {
    return this.appointments().filter(a => a.status === 'confirmed').length;
  }

  get totalAppointmentsCount(): number {
    return this.appointments().length;
  }

  // Lógica para navegación de fecha
  navigateToDate(days: number): void {
    const newDate = new Date(this.currentDate());
    newDate.setDate(newDate.getDate() + days);
    this.currentDate.set(newDate);
  }

  // Método para obtener clases dinámicas según el estado
  getAppointmentClasses(status: AppointmentUI['status']): string {
    switch (status) {
      case 'confirmed':
        return 'border-green-400 bg-green-50 text-green-900';
      case 'cancelled':
        return 'border-red-400 bg-red-50 text-red-900';
      case 'pending':
        return 'border-yellow-400 bg-yellow-50 text-yellow-900';
      case 'available':
        return 'border-gray-300 bg-gray-50 text-gray-700 hover:shadow-md';
      case 'completed':
        return 'border-gray-400 bg-gray-200 text-gray-800';
      default:
        return 'border-gray-300 bg-white text-gray-900';
    }
  }
}
