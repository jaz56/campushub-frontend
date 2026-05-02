import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminEvent } from '../../services/admin.service';

@Component({
  selector: 'app-events-validation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-validation.html'
})
export class EventsValidation implements OnInit {
  events: AdminEvent[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.adminService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approuver(event: AdminEvent): void {
    this.adminService.approuverEvent(event.id).subscribe({
      next: () => this.loadEvents(),
      error: (err) => console.error(err)
    });
  }

  rejeter(event: AdminEvent): void {
    const commentaire = prompt('Raison du rejet :') || '';
    this.adminService.rejeterEvent(event.id, commentaire).subscribe({
      next: () => this.loadEvents(),
      error: (err) => console.error(err)
    });
  }
}