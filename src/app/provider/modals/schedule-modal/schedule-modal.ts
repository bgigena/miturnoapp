import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CalendarModule, CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, endOfDay, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

// Definición de las estructuras de datos
interface RecurrentSchedule {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  enabled: boolean;
  start: string; // Ej: '10:00'
  end: string;   // Ej: '20:00'
}

interface Exception {
  id: number;
  date: string; // Ej: '2025-12-25'
  reason: string;
}
@Component({
  selector: 'app-schedule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  templateUrl: './schedule-modal.html',
  styleUrl: './schedule-modal.css',
})
export class ScheduleModal {

  isModalVisible = input(false);
  modalClosed = output<void>();

  activeDay = signal(false);
  day = signal(new Date());
  // Configuración del calendario
  view: CalendarView = CalendarView.Month;
  viewDate = signal(new Date()); // Fecha actual del calendario

  // Excepciones (Mapeadas a CalendarEvent)
  exceptions = signal<Exception[]>([
    { id: 1, date: '2025-12-24', reason: 'Nochebuena' },
    { id: 2, date: '2025-12-31', reason: 'Inventario' },
  ]);

  // Datos para agregar una nueva excepción
  newExceptionDate: Date | null = null;
  newExceptionReason: string = '';

  // Mapa las excepciones a eventos que el calendario puede renderizar
  get calendarEvents(): CalendarEvent[] {
    return this.exceptions().map(e => ({
      start: startOfDay(new Date(e.date)),
      end: endOfDay(new Date(e.date)),
      title: `CERRADO: ${e.reason}`,
      color: { primary: '#dc2626', secondary: '#fecaca' }, // Rojo
      allDay: true,
      id: e.id,
    }));
  }

  // Horario Recurrente (se mantiene igual)
  schedule: RecurrentSchedule[] = [
    // ... (datos del horario semanal) ...
  ];

  constructor() { }

  setViewDate(newDate: Event): void {
    if (newDate instanceof Date) {
      this.viewDate.set(newDate);
    } else {
      console.error('Error: El valor proporcionado no es un objeto Date válido.');
    }
  }
  // Métodos de control del Modal (closeModal, saveSchedule) se mantienen.
  goToToday(): void {
    this.viewDate.set(new Date());
  }
  // Método para navegar al mes anterior
  prevMonth(): void {
    this.viewDate.set(subMonths(this.viewDate(), 1));
  }

  // Método para navegar al mes siguiente
  nextMonth(): void {
    this.viewDate.set(addMonths(this.viewDate(), 1));
  }
  // ⬇️ Nuevo: Manejar clic en una fecha del calendario ⬇️
  dayClicked({ day }: { day: { date: Date, events: CalendarEvent[] } }): void {
    // ⬇️ Extraemos date y events directamente de 'day' ⬇️
    const { date, events } = day;
    this.day.set(date);
    this.activeDay.set(!this.activeDay());
    // Si ya existe un evento ese día, permitimos eliminarlo o ver detalles
    if (events.length > 0) {
      // Si la fecha ya tiene eventos, limpiamos la selección para forzar al usuario a eliminar
      this.newExceptionDate = null;
      this.newExceptionReason = '';
      return;
    }

    // Si la fecha es nueva, la seleccionamos para el formulario
    this.newExceptionDate = date;
    console.log('Fecha seleccionada para excepción:', date);
  }

  // ⬇️ Nuevo: Agregar una excepción ⬇️
  addException(): void {
    if (this.newExceptionDate && this.newExceptionReason) {
      const dateString = this.newExceptionDate.toISOString().split('T')[0];
      const newId = this.exceptions().length > 0 ? Math.max(...this.exceptions().map(e => e.id)) + 1 : 1;

      this.exceptions.update(exceptions => [
        ...exceptions,
        { id: newId, date: dateString, reason: this.newExceptionReason }
      ]);

      this.newExceptionDate = null;
      this.newExceptionReason = '';
      this.viewDate.set(new Date(dateString)); // Mantiene el calendario en la fecha
    }
  }

  // ⬇️ Nuevo: Eliminar una excepción ⬇️
  removeException(eventId: number): void {
    this.exceptions.update(exceptions => exceptions.filter(e => e.id !== eventId));
  }

  closeModal(): void {
    console.log('Modal cerrado por el usuario.');
    this.modalClosed.emit();
  }

  /**
   * Maneja la lógica de guardar los horarios recurrentes y las excepciones.
   * Por ahora, solo simula el guardado y cierra el modal.
   */
  saveSchedule(): void {
    console.log('Horario Recurrente a guardar:', this.schedule);
    console.log('Excepciones a guardar:', this.exceptions());

    // NOTA: Aquí iría la llamada a un servicio para persistir los datos
    // Ejemplo: this.scheduleService.updateSchedule(this.schedule, this.exceptions());

    alert('Configuración de horario guardada exitosamente!');
    this.closeModal(); // Cierra el modal después de guardar
  }
}