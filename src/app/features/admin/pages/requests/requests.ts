import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.html'
})
export class Requests implements OnInit {
  activeTab = 'tous';
  rejectComment = '';
  showRejectModal = false;
  selectedRequest: any = null;
  requests: any[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.adminService.getAllDemandes().subscribe({
      next: (data) => {
        this.requests = [...data];  // ← spread pour forcer la détection
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

  get filteredRequests() {
    if (this.activeTab === 'tous') return this.requests;
    const map: any = { 'en_attente': 'EN_ATTENTE', 'approuve': 'APPROUVE', 'rejete': 'REJETE' };
    return this.requests.filter(r => r.statut === map[this.activeTab]);
  }

  approuver(r: any): void {
    this.adminService.approuverDemande(r.id).subscribe({
      next: () => {
        this.requests = [];  // ← vide d'abord
        this.cdr.detectChanges();
        this.loadRequests();  // ← puis recharge
      },
      error: (err) => console.error(err)
    });
  }

  openRejectModal(r: any): void {
    this.selectedRequest = r;
    this.showRejectModal = true;
    this.rejectComment = '';
  }

  confirmerRejet(): void {
    if (this.selectedRequest) {
      this.adminService.rejeterDemande(this.selectedRequest.id, this.rejectComment).subscribe({
        next: () => {
          this.showRejectModal = false;
          this.selectedRequest = null;
          this.loadRequests();
        },
        error: (err) => console.error(err)
      });
    }
  }

  getTypeIcon(type: string): string {
    const icons: any = { 'CERTIFICAT': '📜', 'REMBOURSEMENT': '💰', 'MATERIEL': '🖥️' };
    return icons[type] || '📋';
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-700',
      'APPROUVE': 'bg-green-100 text-green-700',
      'REJETE': 'bg-red-100 text-red-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }
}