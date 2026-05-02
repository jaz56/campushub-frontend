import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminReservation } from '../../services/admin.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.html'
})
export class Reservations implements OnInit {
  reservations: AdminReservation[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.adminService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
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

  approuver(r: AdminReservation): void {
    this.adminService.approuverReservation(r.id).subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error(err)
    });
  }

  rejeter(r: AdminReservation): void {
    const commentaire = prompt('Raison du rejet :') || '';
    this.adminService.rejeterReservation(r.id, commentaire).subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error(err)
    });
  }
}