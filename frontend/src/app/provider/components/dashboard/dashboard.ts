import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [DatePipe]
})
export class Dashboard {
  today = new Date();

  todayStats = {
    totalAppointments: 8,
    completed: 5,
    pending: 3,
    revenue: 12500,
    extras: 2300,
  };

  upcomingAppointments = [
    {
      id: '1',
      clientName: 'Juan Pérez',
      service: 'Corte + Barba',
      time: '15:00',
      duration: 45,
      price: 3500,
      status: 'confirmed',
      phone: '+54 341 1234567',
    },
    {
      id: '2',
      clientName: 'María García',
      service: 'Tintura',
      time: '16:00',
      duration: 90,
      price: 8000,
      status: 'confirmed',
      phone: '+54 341 7654321',
    },
    {
      id: '3',
      clientName: 'Carlos López',
      service: 'Corte',
      time: '17:30',
      duration: 30,
      price: 2500,
      status: 'pending',
      phone: '+54 341 9876543',
    },
  ];

  completedAppointments = [
    {
      id: '4',
      clientName: 'Ana Martínez',
      service: 'Alisado',
      time: '09:00',
      price: 15000,
      extras: 1500,
    },
    {
      id: '5',
      clientName: 'Luis Rodríguez',
      service: 'Corte + Barba',
      time: '10:00',
      price: 3500,
      extras: 0,
    },
    {
      id: '6',
      clientName: 'Sofía Fernández',
      service: 'Corte',
      time: '11:30',
      price: 2500,
      extras: 800,
    },
    {
      id: '7',
      clientName: 'Diego Gómez',
      service: 'Barba',
      time: '13:00',
      price: 1800,
      extras: 0,
    },
    {
      id: '8',
      clientName: 'Laura Sánchez',
      service: 'Lavado + Brushing',
      time: '14:00',
      price: 3200,
      extras: 0,
    },
  ];

  frequentClients = [
    { name: 'Juan Pérez', visits: 12, lastVisit: '2026-03-13' },
    { name: 'María García', visits: 8, lastVisit: '2026-03-10' },
    { name: 'Carlos López', visits: 6, lastVisit: '2026-03-08' },
  ];
}
