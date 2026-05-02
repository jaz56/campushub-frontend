import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html'
})
export class Analytics implements OnInit {

  stats = [
    { label: 'Total utilisateurs', value: '...', change: '', up: true, icon: '👥' },
    { label: 'Total événements', value: '...', change: '', up: true, icon: '📅' },
    { label: 'Événements en attente', value: '...', change: '', up: false, icon: '⏳' },
    { label: 'Demandes en attente', value: '...', change: '', up: false, icon: '📋' },
  ];

  // Données statiques gardées pour les graphiques
  eventsByMonth = [
    { month: 'Jan', count: 8, height: '40%' },
    { month: 'Fév', count: 12, height: '60%' },
    { month: 'Mar', count: 18, height: '90%' },
    { month: 'Avr', count: 15, height: '75%' },
    { month: 'Mai', count: 20, height: '100%' },
    { month: 'Jun', count: 14, height: '70%' },
  ];

  usersByRole = [
    { role: 'Étudiants', count: 0, percentage: 78, color: 'bg-blue-500' },
    { role: 'Enseignants', count: 0, percentage: 12, color: 'bg-green-500' },
    { role: 'Clubs', count: 0, percentage: 8, color: 'bg-purple-500' },
    { role: 'Admins', count: 0, percentage: 2, color: 'bg-red-500' },
  ];

  recentActivity = [
    { action: 'Nouvel événement créé', detail: 'Hackathon IA — Club Robotique', time: 'Il y a 2h', icon: '📅' },
    { action: 'Réservation approuvée', detail: 'Amphi A — Dr. Trabelsi', time: 'Il y a 3h', icon: '🏫' },
    { action: 'Nouveau membre inscrit', detail: 'Ahmed Ben Ali — Étudiant', time: 'Il y a 5h', icon: '👤' },
    { action: 'Demande traitée', detail: 'Certificat de scolarité — Leila Bouzid', time: 'Il y a 6h', icon: '📋' },
    { action: 'Club approuvé', detail: 'Club Intelligence Artificielle', time: 'Il y a 1j', icon: '🎯' },
  ];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = [
          { label: 'Total utilisateurs', value: String(data.totalUsers), change: '', up: true, icon: '👥' },
          { label: 'Total événements', value: String(data.totalEvents), change: '', up: true, icon: '📅' },
          { label: 'Événements en attente', value: String(data.pendingEvents), change: '', up: false, icon: '⏳' },
          { label: 'Demandes en attente', value: String(data.pendingDemandes), change: '', up: false, icon: '📋' },
        ];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}