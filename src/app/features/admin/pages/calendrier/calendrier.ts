import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { AdminService } from '../../services/admin.service';
import { ReservationService, Reservation, Salle } from '../../../enseignant/services/reservation';

@Component({
  selector: 'app-admin-calendrier',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, RouterModule],
  templateUrl: './calendrier.html',
  styleUrls: ['./calendrier.scss']
})
export class AdminCalendrier implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    height: 'auto',
    weekends: true,
    hiddenDays: [0], // 0 = Dimanche (masqué), 6 = Samedi (affiché)
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventDidMount: this.handleEventRender.bind(this)
  };

  reservations: Reservation[] = [];
  salles: Salle[] = [];
  loading = true;

  // Modal détails
  reservationSelectionnee?: Reservation;
  showDetails = false;
  dateCliquee?: Date;

  // Filtres
  filtreBatiment = 'TOUS';
  filtreStatut = 'TOUS';

  // Statistiques
  nombreReservationsAujourdhui = 0;
  nombreConflits = 0;
  sallesDisponibles = 0;
  nombreEnAttente = 0;


  constructor(
    private adminService: AdminService,
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.loading = true;
    Promise.all([
      this.adminService.getToutesReservations().toPromise(),
      this.reservationService.getSalles().toPromise()
    ]).then(([reservations, salles]) => {
      this.reservations = reservations || [];
      this.salles = salles || [];
      this.calculerStatistiques();
      this.afficherReservations();
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('❌ Erreur:', error);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  afficherReservations(): void {
    let filtrees = this.reservations;

    if (this.filtreBatiment !== 'TOUS') {
      filtrees = filtrees.filter((r: any) => r.batiment === this.filtreBatiment);
    }
    if (this.filtreStatut !== 'TOUS') {
      filtrees = filtrees.filter(r => r.statut === this.filtreStatut);
    }

    // Détecte les IDs en conflit
    const conflictIds = new Set<any>();
    for (let i = 0; i < filtrees.length; i++) {
      for (let j = i + 1; j < filtrees.length; j++) {
        const r1 = filtrees[i] as any;
        const r2 = filtrees[j] as any;
        if (r1.salle === r2.salle) {
          const d1 = new Date(r1.dateDebut), f1 = new Date(r1.dateFin);
          const d2 = new Date(r2.dateDebut), f2 = new Date(r2.dateFin);
          if (d1 < f2 && d2 < f1) {
            conflictIds.add(r1.id);
            conflictIds.add(r2.id);
          }
        }
      }
    }

    const events: EventInput[] = filtrees.map((r: any) => ({
      id: r.id,
      title: conflictIds.has(r.id)
        ? `⚠️ CONFLIT — ${r.salleNom || r.salle} — ${r.motif}`
        : `${r.salleNom || r.salle} — ${r.motif}`,
      start: r.dateDebut,
      end: r.dateFin,
      backgroundColor: conflictIds.has(r.id) ? '#ef4444' : this.getEventColor(r.statut),
      borderColor: conflictIds.has(r.id) ? '#b91c1c' : this.getEventColor(r.statut),
      extendedProps: { reservation: r, isConflict: conflictIds.has(r.id) }
    }));

    this.calendarOptions = { ...this.calendarOptions, events };
  }
  getEventColor(statut: string): string {
    switch (statut) {
      case 'APPROUVEE': return '#10b981';
      case 'EN_ATTENTE': return '#f59e0b';
      case 'REJETEE': return '#ef4444';
      default: return '#6b7280';
    }
  }

  handleEventClick(arg: EventClickArg): void {
    this.reservationSelectionnee = arg.event.extendedProps['reservation'] as Reservation;
    this.showDetails = true;
  }

  handleDateClick(arg: any): void {
    this.dateCliquee = new Date(arg.date);
  }

  handleEventRender(arg: any): void {
    arg.el.title = arg.event.extendedProps['reservation']?.motif || '';
  }

  calculerStatistiques(): void {
    const aujourd = new Date();
    aujourd.setHours(0, 0, 0, 0);
    const demain = new Date(aujourd);
    demain.setDate(demain.getDate() + 1);

    this.nombreReservationsAujourdhui = this.reservations.filter(r => {
      const d = new Date(r.dateDebut);
      return d >= aujourd && d < demain;
    }).length;

    this.nombreEnAttente = this.reservations.filter(r => r.statut === 'EN_ATTENTE').length;
    this.nombreConflits = this.detecterConflits();
    this.sallesDisponibles = this.calculerSallesDisponibles();
  }

  detecterConflits(): number {
    let conflits = 0;
    const maintenant = new Date();
    const approuvees = this.reservations.filter(r => r.statut === 'APPROUVEE');

    for (let i = 0; i < approuvees.length; i++) {
      const r1 = approuvees[i];
      if (new Date(r1.dateDebut) < maintenant) continue;
      for (let j = i + 1; j < approuvees.length; j++) {
        const r2 = approuvees[j];
        if (r1.salleId === r2.salleId) {
          const d1 = new Date(r1.dateDebut), f1 = new Date(r1.dateFin);
          const d2 = new Date(r2.dateDebut), f2 = new Date(r2.dateFin);
          if (d1 < f2 && d2 < f1) conflits++;
        }
      }
    }
    return conflits;
  }

  calculerSallesDisponibles(): number {
    const maintenant = new Date();
    const occupees = new Set(
      this.reservations
        .filter(r => {
          const d = new Date(r.dateDebut), f = new Date(r.dateFin);
          return d <= maintenant && f >= maintenant && r.statut === 'APPROUVEE';
        })
        .map(r => r.salleId)
    );
    return this.salles.length - occupees.size;
  }

  appliquerFiltreBatiment(batiment: string): void {
    this.filtreBatiment = batiment;
    this.afficherReservations();
  }

  appliquerFiltreStatut(statut: string): void {
    this.filtreStatut = statut;
    this.afficherReservations();
  }

  fermerDetails(): void {
    this.showDetails = false;
    this.reservationSelectionnee = undefined;
  }

  approuverReservation(id: string): void {
    if (confirm('Approuver cette réservation ?')) {
      this.adminService.approuverReservation(Number(id)).subscribe({
        next: () => {
          alert('✅ Réservation approuvée');
          this.fermerDetails();
          this.chargerDonnees();
        },
        error: () => alert('❌ Erreur lors de l\'approbation')
      });
    }
  }

  rejeterReservation(id: string): void {
    const commentaire = prompt('Raison du rejet :') || '';
    this.adminService.rejeterReservation(Number(id), commentaire).subscribe({
      next: () => {
        alert('✅ Réservation rejetée');
        this.fermerDetails();
        this.chargerDonnees();
      },
      error: () => alert('❌ Erreur lors du rejet')
    });
  }
  exporterCalendrier(): void {
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CampusHub ENICarthage Admin//FR\nCALSCALE:GREGORIAN\n';
    this.reservations.forEach(r => {
      ical += 'BEGIN:VEVENT\n';
      ical += `UID:${r.id}@campushub.enicarthage.tn\n`;
      ical += `DTSTAMP:${this.formatDateICal(new Date())}\n`;
      ical += `DTSTART:${this.formatDateICal(new Date(r.dateDebut))}\n`;
      ical += `DTEND:${this.formatDateICal(new Date(r.dateFin))}\n`;
      ical += `SUMMARY:${r.salle?.nom} - ${r.motif}\n`;
      ical += `LOCATION:${r.salle?.batiment} - Étage ${r.salle?.etage}\n`;
      ical += `STATUS:${r.statut === 'APPROUVEE' ? 'CONFIRMED' : 'TENTATIVE'}\n`;
      ical += 'END:VEVENT\n';
    });
    ical += 'END:VCALENDAR';

    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendrier-admin-campushub.ics';
    a.click();
    window.URL.revokeObjectURL(url);
    alert('✅ Calendrier exporté !');
  }

  formatDateICal(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}
