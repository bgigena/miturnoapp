import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SchedulePanel } from '@provider/components/schedule-panel/schedule-panel';
import { ServiceManagementPanel } from '@provider/components/service-management-panel/service-management-panel';
import { BookingLinkPanel } from '@provider/components/booking-link-panel/booking-link-panel';
import { DailyAgenda } from '../daily-agenda/daily-agenda';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    DailyAgenda,
    ServiceManagementPanel,
    SchedulePanel,
    BookingLinkPanel
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
