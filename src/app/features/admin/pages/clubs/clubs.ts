import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clubs.html'
})
export class Clubs implements OnInit {
  clubs: any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.adminService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
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

  approuver(club: any): void {
    this.adminService.approuverClub(club.id).subscribe({
      next: () => this.loadClubs(),
      error: (err) => console.error(err)
    });
  }

  suspendre(club: any): void {
    this.adminService.suspendreClub(club.id).subscribe({
      next: () => this.loadClubs(),
      error: (err) => console.error(err)
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'ACTIF': 'bg-green-100 text-green-700',
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-700',
      'SUSPENDU': 'bg-red-100 text-red-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }
}