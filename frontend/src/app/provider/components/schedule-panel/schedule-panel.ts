import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScheduleModal } from '@provider/modals/schedule-modal/schedule-modal';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-schedule-panel',
  standalone: true,
  imports: [CommonModule, ScheduleModal, CardModule, ButtonModule],
  templateUrl: './schedule-panel.html',
  styleUrl: './schedule-panel.css',
})
export class SchedulePanel {
  isScheduleModalVisible: boolean = false;

  openScheduleModal(): void {
    this.isScheduleModalVisible = true;
    console.log('Modal de Horarios visible.');
  }

  closeScheduleModal(): void {
    this.isScheduleModalVisible = false;
    console.log('Modal de Horarios cerrado.');
  }
}
