import { Component } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [DecimalPipe, DatePipe]
})
export class Dashboard {
  statsData = {
    totalAppointments: 342,
    appBookings: 218,
    manualBookings: 124,
    totalRevenue: 109000,
    commissionRevenue: 171000,
    activeProviders: 12,
    activeClients: 156,
  };

  providerAppointmentsData = [
    { name: 'Totito', turnos: 45, ingresos: 22500, percentage: 45 },
    { name: 'Elegancia', turnos: 38, ingresos: 19000, percentage: 38 },
    { name: 'Style Cut', turnos: 35, ingresos: 17500, percentage: 35 },
    { name: 'Barbería Moderna', turnos: 32, ingresos: 16000, percentage: 32 },
    { name: 'Salón Premium', turnos: 28, ingresos: 14000, percentage: 28 },
  ];

  topServicesData = [
    { service: 'Corte de Cabello', count: 125, percentage: 36.5 },
    { service: 'Barba', count: 89, percentage: 26.0 },
    { service: 'Tintura', count: 56, percentage: 16.4 },
    { service: 'Alisado', count: 38, percentage: 11.1 },
    { service: 'Lavado', count: 34, percentage: 9.9 },
  ];

  recentTransactions = [
    { id: 'TXN-001', provider: 'Totito', client: 'Juan Pérez', amount: 500, date: '2026-03-13', time: '14:30' },
    { id: 'TXN-002', provider: 'Elegancia', client: 'María García', amount: 500, date: '2026-03-13', time: '13:15' },
    { id: 'TXN-003', provider: 'Style Cut', client: 'Carlos López', amount: 500, date: '2026-03-13', time: '12:00' },
    { id: 'TXN-004', provider: 'Barbería Moderna', client: 'Ana Martínez', amount: 500, date: '2026-03-13', time: '11:45' },
  ];
}
