import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id: number;
  cliente_id: number;
  proveedor_id: number;
  servicio_id: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO' | 'AUSENTE';
  notas?: string;
  // Extended fields from joins
  cliente_nombre?: string;
  cliente_apellido?: string;
  servicio_nombre?: string;
  proveedor_nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appointments`;

  getAppointments(date?: string): Observable<Appointment[]> {
    let url = this.apiUrl;
    if (date) {
      url += `?date=${date}`;
    }
    return this.http.get<Appointment[]>(url);
  }

  createAppointment(appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
