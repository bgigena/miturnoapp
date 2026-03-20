import { Component } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [DatePipe]
})
export class Dashboard {
  today = new Date();
  
  upcomingAppointment = {
    id: '1',
    providerName: 'Totito Barbería & Estética',
    service: 'Corte + Barba',
    date: new Date(this.today.setDate(this.today.getDate() + 2)),
    time: '15:00',
    address: 'Av. Pellegrini 1234, Rosario',
    price: 3500,
    commission: 500,
    status: 'confirmed',
    rating: 4.8,
  };

  popularServices = [
    { name: 'Corte de Cabello', icon: '✂️' },
    { name: 'Barba', icon: '🧔' },
    { name: 'Tintura', icon: '🎨' },
    { name: 'Alisado', icon: '💆' },
  ];

  recentProviders = [
    {
      id: '1',
      name: 'Totito Barbería & Estética',
      address: 'Av. Pellegrini 1234, Rosario',
      rating: 4.8,
      reviews: 125,
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop',
    },
    {
      id: '2',
      name: 'Elegancia Hair Studio',
      address: 'San Martín 567, Rosario',
      rating: 4.6,
      reviews: 89,
      distance: '2.5 km',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop',
    },
    {
      id: '3',
      name: 'Style Cut',
      address: 'Entre Ríos 890, Rosario',
      rating: 4.7,
      reviews: 102,
      distance: '3.1 km',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop',
    },
  ];
}
