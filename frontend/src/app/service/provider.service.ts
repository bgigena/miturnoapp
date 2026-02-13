import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Provider {
  id: number;
  usuario_id: number;
  nombre_negocio: string;
  telefono_contacto: string;
  email?: string;
}

export interface ProviderServiceItem {
  proveedor_id: number;
  servicio_id: number;
  precio_especifico: number;
  nombre: string;
  duracion_minutos: number;
  precio_base: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/providers`;

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiUrl);
  }

  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/${id}`);
  }

  createProfile(profile: any): Observable<Provider> {
    return this.http.post<Provider>(this.apiUrl, profile);
  }

  updateProfile(id: number, profile: any): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/${id}`, profile);
  }

  getServices(providerId: number): Observable<ProviderServiceItem[]> {
    return this.http.get<ProviderServiceItem[]>(`${this.apiUrl}/${providerId}/services`);
  }

  addService(providerId: number, serviceId: number, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${providerId}/services`, { service_id: serviceId, precio_especifico: price });
  }

  removeService(providerId: number, serviceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${providerId}/services/${serviceId}`);
  }
}
