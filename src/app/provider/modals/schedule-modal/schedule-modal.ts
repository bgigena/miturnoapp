import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule, CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { startOfDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { Subject } from 'rxjs';

// Definición de la estructura de datos
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleModal {

  refresh = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  isModalVisible = input(false);
  modalClosed = output<void>();

  activeDay = signal<boolean>(false);
  day = signal<Date | null>(new Date());
  viewDate = signal(startOfDay(new Date()));
  showGlobalForm = signal<boolean>(false);

  // Excepciones
  exceptions = signal<Exception[]>([
    { id: 1, date: '2025-12-24', reason: 'Nochebuena' },
    { id: 2, date: '2025-12-30', reason: 'Inventario' },
    { id: 3, date: '2025-12-31', reason: 'Vispera Año nuevo' },
  ]);

  // Datos para agregar una nueva excepción
  newExceptionDate: Date | null = null;
  newExceptionReason: string = '';
  isSameDay = (arg0: Date, arg1: any) => isSameDay(arg0, arg1);

  // Mapa las excepciones a eventos (con corrección para Zona Horaria)
  calendarEvents = computed<CalendarEvent[]>(() => {
    return this.exceptions().map(e => {
      const parts = e.date.split('-');
      const year = Number(parts[0]);
      const monthIndex = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      // Crea la fecha en la zona horaria local para evitar retrocesos de día
      const localDate = new Date(year, monthIndex, day);

      return {
        start: startOfDay(localDate),
        title: `CERRADO: ${e.reason}`,
        color: { primary: '#dc2626', secondary: '#fecaca' },
        allDay: true,
        id: e.id,
        meta: { originalException: e }
      } as CalendarEvent;
    });
  });


  setViewDate(newDate: Event): void {
    if (newDate instanceof Date) {
      this.viewDate.set(newDate);
    } else {
      console.error('Error: El valor proporcionado no es un objeto Date válido.');
    }
  }

  goToToday(): void {
    this.viewDate.set(new Date());
  }

  prevMonth(): void {
    this.viewDate.set(subMonths(this.viewDate(), 1));
  }

  nextMonth(): void {
    this.viewDate.set(addMonths(this.viewDate(), 1));
  }

  cancelNewException(): void {
    this.newExceptionDate = null;
    this.newExceptionReason = '';

    this.showGlobalForm.set(false); // Cierra el formulario global
    this.activeDay.set(false);
    this.day.set(null);
    this.refresh.next();
  }

  dayClicked({ day }: { day: CalendarMonthViewDay }): void {

    const clickedDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
    const currentDay = this.day();
    const isSameDate = currentDay && isSameDay(currentDay, clickedDate);

    const hasEvents = day.events && day.events.length > 0;

    if (isSameDate) {
      this.activeDay.update(isOpen => {
        if (isOpen) {
          this.day.set(null);
          this.showGlobalForm.set(false);
        }
        return !isOpen;
      });

    } else {
      this.day.set(clickedDate);
      this.newExceptionDate = clickedDate;

      if (hasEvents) {
        this.activeDay.set(true);
        this.showGlobalForm.set(false);
      } else {
        this.activeDay.set(false);
        this.showGlobalForm.set(true);
      }
    }

    this.refresh.next();
    this.cdr.detectChanges();
  }

  addException(): void {
    if (!this.newExceptionReason.trim() || !this.newExceptionDate) {
      return;
    }

    const newId = Date.now();

    const year = this.newExceptionDate.getFullYear();
    const month = this.newExceptionDate.getMonth() + 1;
    const day = this.newExceptionDate.getDate();

    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    const localDateString = `${year}-${formattedMonth}-${formattedDay}`;

    const newException: Exception = {
      id: newId,
      date: localDateString,
      reason: this.newExceptionReason.trim()
    };

    this.exceptions.update(exceptions => [...exceptions, newException]);

    this.newExceptionReason = '';
    this.newExceptionDate = null;
    this.showGlobalForm.set(false);
    this.activeDay.set(false);
    this.day.set(null);

    this.refresh.next();
    this.cdr.detectChanges();
  }

  removeException(eventId: string | number | undefined): void {

    if (eventId === undefined || eventId === null) {
      console.warn("Intento de eliminar una excepción con ID nulo o indefinido.");
      return;
    }

    const numericId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;

    this.exceptions.update(currentExceptions => {
      const updatedExceptions = currentExceptions.filter(
        exception => exception.id !== numericId
      );

      const currentActiveDay = this.day();
      if (currentActiveDay) {
        const remainingEvents = this.calendarEvents().filter(e =>
          isSameDay(e.start, currentActiveDay) && e.id !== numericId
        );

        if (remainingEvents.length === 0) {
          this.activeDay.set(false);
          this.day.set(null);
        }
      }

      return updatedExceptions;
    });

    this.refresh.next();
    this.cdr.detectChanges();
  }

  closeModal(): void {
    console.log('Modal cerrado por el usuario.');
    this.modalClosed.emit();
  }

  saveSchedule(): void {
    console.log('Excepciones a guardar:', this.exceptions());

    alert('Configuración de horario guardada exitosamente!');
    this.closeModal();
  }
}