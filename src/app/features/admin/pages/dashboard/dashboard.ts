import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats, AdminEvent } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  stats: AdminStats = {
    totalUsers: 0, totalEvents: 0, pendingEvents: 0,
    pendingReservations: 0, pendingDemandes: 0, totalClubs: 0
  };
  pendingEvents: AdminEvent[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.adminService.getPendingEvents().subscribe({
      next: (events) => {
        this.pendingEvents = events;
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

  approuver(id: number): void {
    this.adminService.approuverEvent(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err)
    });
  }

  rejeter(id: number): void {
    const commentaire = prompt('Raison du rejet :') || '';
    this.adminService.rejeterEvent(id, commentaire).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err)
    });
  }
}