import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { Demande } from '../../../../core/models';

@Component({
  selector: 'app-mes-demandes',
  templateUrl: './mes-demandes.html',
  styleUrls: ['./mes-demandes.scss'],
  standalone: false
})
export class MesDemandesComponent implements OnInit {
  demandes: Demande[] = [];
  loading = true;
  showModal = false;
  nouveauType = '';
  nouveauMessage = '';

  constructor(
    private demandeService: DemandeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.demandeService.getMyRequests().subscribe({
      next: (data) => {
        this.demandes = data;
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

  ouvrirNouvelleDemandeModal(): void {
    this.showModal = true;
    this.cdr.detectChanges();
  }

  fermerModal(): void {
    this.showModal = false;
    this.nouveauType = '';
    this.nouveauMessage = '';
  }

  soumettreDemandeLocale(): void {
    if (!this.nouveauType) return;

    this.demandeService.createRequest({
      type: this.nouveauType,
      message: this.nouveauMessage
    }).subscribe({
      next: (result) => {
        this.demandes = [result, ...this.demandes];
        this.fermerModal();
        this.cdr.detectChanges();
        alert('✅ Demande soumise avec succès !');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Erreur lors de la soumission');
      }
    });
  }

  countByStatus(status: string): number {
    return this.demandes.filter(d => d.status === status).length;
  }

  getStatutClass(status: string): string {
    const map: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return map[status] || '';
  }

  getStatutIcon(status: string): string {
    return { APPROVED: '✅', REJECTED: '❌', PENDING: '⏳' }[status] || '';
  }

  getStatutLabel(status: string): string {
    return { APPROVED: 'Approuvée', REJECTED: 'Rejetée', PENDING: 'En attente' }[status] || status;
  }
}