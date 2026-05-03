import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import { Header } from '../../../../shared/components/header/header';
import { Demande } from '../../../../core/models';
@Component({
  selector: 'app-mes-demandes-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './mes-demandes.html'
})
export class MesDemandes implements OnInit {
  demandes: Demande[] = [];
  loading = true;
  showModal = false;
  nouveauType = '';
  nouveauMessage = '';

  private demandeService = inject(DemandeService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.chargerDemandes();
  }

  chargerDemandes(): void {
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

  soumettreDemande(): void {
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

  getStatutClass(status: string): string {
    const map: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  getStatutIcon(status: string): string {
    return { APPROVED: '✅', REJECTED: '❌', PENDING: '⏳' }[status] || '📄';
  }

  getStatutLabel(status: string): string {
    return { APPROVED: 'Approuvée', REJECTED: 'Rejetée', PENDING: 'En attente' }[status] || status;
  }
}
