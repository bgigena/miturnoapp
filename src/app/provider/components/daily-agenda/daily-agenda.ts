import { CommonModule } from '@angular/common';
import { 
    ChangeDetectionStrategy, 
    Component, 
    computed, 
    signal, 
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDays, subDays, format, setHours, setMinutes } from 'date-fns';

interface Appointment {
  id: number;
  client: string;
  service: string;
  price: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'available';
  details?: string;
  time: string; 
  startHour: number;    
  startMinute: number;  
  durationMinutes: number; 
}

@Component({
  selector: 'app-daily-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-agenda.html',
  styleUrls: ['./daily-agenda.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyAgenda implements AfterViewInit { 

  @ViewChild('agendaContainer') agendaContainer!: ElementRef<HTMLDivElement>;

  // Configuración de la Agenda
  private readonly agendaStartHour = 9; 
  private readonly agendaEndHour = 20; // 👈 Ampliado hasta las 20hs
  private readonly segmentMinutes = 30; 
  private readonly ROW_HEIGHT_REM = 7.5; // 👈 Altura base de cada pista

  currentDate = signal(new Date());
  selectedAppointment = signal<Appointment | null>(null);

  // ----------------------------------------------------
  // Datos de Ejemplo (Corregidos IDs y horas)
  // ----------------------------------------------------
  appointments = signal<Appointment[]>([
    {
      id: 1, client: 'Juan Pérez', service: 'Corte Clásico', price: 10000, status: 'confirmed', time: '10:00 - 10:45',
      startHour: 10, startMinute: 0, durationMinutes: 45
    },
    {
      id: 2, client: 'María García', service: 'Tintura', price: 25000, status: 'cancelled', time: '10:25 - 11:25',
      startHour: 10, startMinute: 25, durationMinutes: 60 
    },
    {
      id: 3, client: 'Laura Fernández', service: 'Alisado Express', price: 30000, status: 'completed', time: '09:00 - 10:00',
      startHour: 9, startMinute: 0, durationMinutes: 60
    },
    {
      id: 4, client: 'Turno Disponible', service: 'Espacio libre', price: 0, status: 'available', time: '11:00 - 12:00',
      startHour: 11, startMinute: 0, durationMinutes: 60
    },
    {
      id: 5, // 👈 Corregido ID duplicado
      client: 'Cosme Fulanito', service: 'Corte Clásico', price: 10000, status: 'confirmed', time: '09:00 - 10:00',
      startHour: 9, startMinute: 0, durationMinutes: 60
    },
  ]);

  // ----------------------------------------------------
  // LÓGICA DE PISTAS (TRACKS)
  // ----------------------------------------------------

  appointmentTracks = computed<Appointment[][]>(() => {
    const sorted = [...this.appointments()].sort((a, b) => {
        const startA = a.startHour * 60 + a.startMinute;
        const startB = b.startHour * 60 + b.startMinute;
        return startA - startB;
    });

    const tracks: Appointment[][] = [];
    const getEndMinutes = (app: Appointment) => (app.startHour * 60 + app.startMinute) + app.durationMinutes;
        
    for (const appointment of sorted) {
        let placed = false;
        for (let track of tracks) {
            const lastApp = track[track.length - 1];
            if ((appointment.startHour * 60 + appointment.startMinute) >= getEndMinutes(lastApp)) {
                track.push(appointment);
                placed = true;
                break;
            }
        }
        if (!placed) tracks.push([appointment]);
    }
    return tracks;
  });

  // 🚨 NUEVO: Calcula la altura total del contenedor para evitar scroll vertical
 getTrackTopStyle(trackIndex: number): string {
    // 0.5rem de margen inicial superior
    return `${trackIndex * this.ROW_HEIGHT_REM + 0.5}rem`; 
}

totalContainerHeight = computed(() => {
    const tracksCount = this.appointmentTracks().length;
    // Altura mínima si no hay nada
    if (tracksCount === 0) return '10rem';
    // Calculamos basándonos en las pistas
    return `${(tracksCount * this.ROW_HEIGHT_REM) + 1}rem`;
});
// 2. Método para abrir el detalle
  openDetail(appointment: Appointment): void {
    // Si es un turno disponible, quizás quieras abrir un formulario de reserva
    // Por ahora, abrimos el detalle de cualquier turno
    this.selectedAppointment.set(appointment);
  }

  // 3. Método para cerrar
  closeDetail(): void {
    this.selectedAppointment.set(null);
  }
  // ----------------------------------------------------
  // Propiedades Computadas
  // ----------------------------------------------------
  totalAppointmentsCount = computed(() => this.appointments().length);
  confirmedAppointmentsCount = computed(() => 
    this.appointments().filter(a => a.status === 'confirmed').length
  );
  
  timeSegments = computed<string[]>(() => {
    const segments: string[] = [];
    let currentTime = setMinutes(setHours(new Date(), this.agendaStartHour), 0);
    const endTime = setMinutes(setHours(new Date(), this.agendaEndHour), 0);
    
    while (currentTime < endTime) {
      segments.push(format(currentTime, 'HH:mm')); 
      currentTime = new Date(currentTime.getTime() + this.segmentMinutes * 60000); 
    }
    return segments;
  });

  // ----------------------------------------------------
  // LÓGICA DE POSICIONAMIENTO
  // ----------------------------------------------------
  
  get totalAgendaMinutes(): number {
      return (this.agendaEndHour - this.agendaStartHour) * 60;
  }

  getAppointmentWidth(durationMinutes: number): string {
    return `${(durationMinutes / this.totalAgendaMinutes) * 100}%`;
  }

  getStartOffset(startHour: number, startMinute: number): string {
    const minutesSinceStart = (startHour - this.agendaStartHour) * 60 + startMinute;
    return `${(minutesSinceStart / this.totalAgendaMinutes) * 100}%`;
  }
  
  getAppointmentClasses(status: string): { [key: string]: boolean } {
    return {
      'bg-green-100 border-green-600 text-green-800': status === 'confirmed',
      'bg-red-100 border-red-600 text-red-800': status === 'cancelled',
      'bg-gray-200 border-gray-400 text-gray-700': status === 'completed',
      'bg-blue-50 border-blue-400 border-dashed text-blue-800': status === 'available',
    };
  }

  // ----------------------------------------------------
  // UTILIDADES Y NAVEGACIÓN
  // ----------------------------------------------------

  ngAfterViewInit(): void {
    if (this.isToday(this.currentDate())) {
        setTimeout(() => this.scrollToCurrentTime(), 100); 
    }
  }
  
  getCurrentTimeOffset(): string {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour < this.agendaStartHour || currentHour >= this.agendaEndHour) return '-100%'; 
    return this.getStartOffset(currentHour, currentMinute);
  }

  scrollToCurrentTime(): void {
    if (this.agendaContainer) {
        const now = new Date();
        const container = this.agendaContainer.nativeElement;
        const minutesSinceStart = (now.getHours() - this.agendaStartHour) * 60 + now.getMinutes();
        const scrollPositionPx = (minutesSinceStart / this.totalAgendaMinutes) * container.scrollWidth;
        container.scrollTo({ left: scrollPositionPx - (container.clientWidth * 0.25), behavior: 'smooth' });
    }
  }

  navigateToDate(days: number): void {
    const newDate = days > 0 ? addDays(this.currentDate(), days) : subDays(this.currentDate(), Math.abs(days));
    this.currentDate.set(newDate);
    if (this.isToday(newDate)) setTimeout(() => this.scrollToCurrentTime(), 100);
  }

  isToday(date: Date): boolean {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }
}