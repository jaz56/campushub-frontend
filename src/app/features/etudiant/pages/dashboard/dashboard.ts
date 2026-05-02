import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClubService } from '../../services/club.service';
import { EvenementService } from '../../services/evenement.service';
import { DemandeService } from '../../services/demande.service';
import { Club, Evenement, Demande } from '../../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  clubs: Club[] = [];
  evenements: any[] = [];
  demandes: Demande[] = [];
  loading = true;

  constructor(
    private clubService: ClubService,
    private evenementService: EvenementService,
    private demandeService: DemandeService,
    private cdr: ChangeDetectorRef  // ← ajoute ça
  ) { }


  ngOnInit(): void {
    console.log('Dashboard étudiant ngOnInit appelé');
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    console.log('loadDashboardData appelé');

    this.clubService.getActiveClubs().subscribe({
      next: (clubs) => {
        console.log('Clubs reçus:', clubs);
        this.clubs = clubs.slice(0, 3);
      },
      error: (err) => {
        console.log('Erreur clubs:', err);
        this.clubs = [];
      }
    });

    this.evenementService.getApprovedEvents().subscribe({
      next: (evenements) => {
        console.log('Evenements reçus:', evenements);
        this.evenements = evenements.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Erreur evenements:', err);
        this.evenements = [];
      }
    });

    this.demandeService.getMyRequests().subscribe({
      next: (demandes) => {
        console.log('Demandes reçues:', demandes);
        this.demandes = demandes.slice(0, 3);
      },
      error: (err) => {
        console.log('Erreur demandes:', err);
        this.demandes = [];
      }
    });

    setTimeout(() => {
      console.log('Timeout — loading = false');
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  register(eventId: number): void {
    this.evenementService.registerForEvent(eventId).subscribe({
      next: (msg) => alert(msg),
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de s\'inscrire'))
    });
  }
}