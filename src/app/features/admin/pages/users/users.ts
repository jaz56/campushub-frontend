import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html'
})
export class Users implements OnInit {
  users: any[] = [];
  usersFiltres: any[] = [];
  recherche = '';
  loading = true;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersFiltres = data;
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

  filtrer(): void {
    const r = this.recherche.toLowerCase();
    this.usersFiltres = this.users.filter(u =>
      u.nom?.toLowerCase().includes(r) ||
      u.prenom?.toLowerCase().includes(r) ||
      u.email?.toLowerCase().includes(r)
    );
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error(err)
      });
    }
  }

  getRoleBadge(role: string): string {
    const badges: any = {
      'ETUDIANT': 'bg-blue-100 text-blue-700',
      'ENSEIGNANT': 'bg-green-100 text-green-700',
      'RESPONSABLE_CLUB': 'bg-purple-100 text-purple-700',
      'ADMIN': 'bg-red-100 text-red-700',
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  }
}