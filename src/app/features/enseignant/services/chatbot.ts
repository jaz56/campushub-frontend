import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService, Salle } from './reservation';
import { ChatbotBaseService, Action } from '../../../shared/services/chatbot-base.service';

@Injectable({ providedIn: 'root' })
export class ChatbotEnseignant extends ChatbotBaseService {

  private conversationState: ConversationState = {
    etape: 'accueil',
    data: {}
  };

  private salles: Salle[] = [];

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {
    super();
    this.chargerSalles();
    this.envoyerMessageBotImmediat(
      "👋 Bonjour ! Je suis **Claude**, votre assistant virtuel ENICarthage.\n\nComment puis-je vous aider aujourd'hui ?",
      [
        { label: '📅 Réserver une salle', type: 'function', data: 'reserver' },
        { label: '📋 Voir mes réservations', type: 'link', data: '/enseignant/mes-reservations' },
        { label: '📅 Calendrier', type: 'link', data: '/enseignant/calendrier' },
        { label: '❓ Aide', type: 'function', data: 'aide' }
      ]
    );
  }

  chargerSalles(): void {
    this.reservationService.getSalles().subscribe({
      next: (salles) => { this.salles = salles; }
    });
  }

  envoyerMessageUtilisateur(texte: string): void {
    console.log('ChatbotEnseignant: Message utilisateur reçu:', texte);
    const message = {
      id: Math.random().toString(36).substr(2, 9),
      texte,
      auteur: 'user' as const,
      timestamp: new Date()
    };
    const messages = this.messagesSubject.value;
    this.messagesSubject.next([...messages, message]);
    this.traiterMessage(texte);
  }

  private traiterMessage(texte: string): void {
    console.log('ChatbotEnseignant: Traitement du message...', texte);
    const texteLower = texte.toLowerCase().trim();

    if (this.conversationState.etape === 'reservation_batiment') { this.traiterChoixBatiment(texte); return; }
    if (this.conversationState.etape === 'reservation_date') { this.traiterChoixDate(texte); return; }
    if (this.conversationState.etape === 'reservation_heure') { this.traiterChoixHeure(texte); return; }
    if (this.conversationState.etape === 'reservation_salle') { this.traiterChoixSalle(texte); return; }
    if (this.conversationState.etape === 'reservation_motif') { this.traiterChoixMotif(texte); return; }

    if (this.detecterIntention(texteLower, ['réserver', 'reservation', 'salle', 'reserver'])) {
      this.demarrerReservation();
    } else if (this.detecterIntention(texteLower, ['aide', 'help', 'comment', 'utiliser'])) {
      this.afficherAide();
    } else if (this.detecterIntention(texteLower, ['mes reservations', 'voir', 'liste', 'historique'])) {
      this.afficherMesReservations();
    } else if (this.detecterIntention(texteLower, ['calendrier', 'planning', 'agenda'])) {
      this.afficherCalendrier();
    } else if (this.detecterIntention(texteLower, ['disponible', 'dispo', 'libre', 'maintenant'])) {
      this.afficherSallesDisponibles();
    } else if (this.detecterIntention(texteLower, ['annexe', 'informatique'])) {
      this.afficherSallesAnnexe();
    } else if (this.detecterIntention(texteLower, ['principal', 'mecatronique', 'mécatronique', 'industriel'])) {
      this.afficherSallesPrincipal();
    } else if (this.detecterIntention(texteLower, ['amphi', 'amphitheatre', 'amphithéâtre'])) {
      this.afficherInfoAmphi();
    } else if (this.detecterIntention(texteLower, ['labo', 'laboratoire'])) {
      this.afficherInfoLabo();
    } else if (this.detecterIntention(texteLower, ['merci', 'thanks', 'super', 'parfait', 'ok'])) {
      this.repondreGentiment();
    } else if (this.detecterIntention(texteLower, ['bonjour', 'salut', 'hello', 'hey'])) {
      this.saluer();
    } else {
      this.repondrePasCompris();
    }
  }

  private detecterIntention(texte: string, motsClés: string[]): boolean {
    return motsClés.some(mot => texte.includes(mot));
  }

  private demarrerReservation(): void {
    this.conversationState.etape = 'reservation_batiment';
    this.conversationState.data = {};
    this.envoyerMessageBot(
      "Parfait ! Je vais vous guider pour réserver une salle. 🎯\n\n**Étape 1/4 :** Quel bâtiment préférez-vous ?",
      [
        { label: '💻 Bâtiment Annexe (Informatique)', type: 'function', data: 'annexe' },
        { label: '🏭 Bâtiment Principal (Mécatronique)', type: 'function', data: 'principal' },
        { label: '🏫 Peu importe', type: 'function', data: 'tous' }
      ]
    );
  }

  private traiterChoixBatiment(choix: string): void {
    this.conversationState.data.batiment = choix;
    this.conversationState.etape = 'reservation_date';
    const batimentText = choix === 'annexe' ? 'Bâtiment Annexe' : choix === 'principal' ? 'Bâtiment Principal' : 'tous les bâtiments';
    this.envoyerMessageBot(
      `Super ! Vous avez choisi : **${batimentText}**\n\n**Étape 2/4 :** Pour quelle date ?`,
      [
        { label: '📅 Aujourd\'hui', type: 'function', data: 'aujourdhui' },
        { label: '📅 Demain', type: 'function', data: 'demain' },
        { label: '📅 Lundi prochain', type: 'function', data: 'lundi' }
      ]
    );
  }

  private traiterChoixDate(choix: string): void {
    let date = new Date();
    if (choix === 'demain') { date.setDate(date.getDate() + 1); }
    else if (choix === 'lundi') {
      const jourActuel = date.getDay();
      const joursJusquaLundi = jourActuel === 0 ? 1 : 8 - jourActuel;
      date.setDate(date.getDate() + joursJusquaLundi);
    }
    this.conversationState.data.date = date;
    this.conversationState.etape = 'reservation_heure';
    const dateFormatee = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    this.envoyerMessageBot(
      `Date : **${dateFormatee}**\n\n**Étape 3/4 :** Quel créneau horaire ?`,
      [
        { label: '🌅 8h - 10h', type: 'function', data: '8-10' },
        { label: '☀️ 10h - 12h', type: 'function', data: '10-12' },
        { label: '🌤️ 14h - 16h', type: 'function', data: '14-16' },
        { label: '🌆 16h - 18h', type: 'function', data: '16-18' }
      ]
    );
  }

  private traiterChoixHeure(choix: string): void {
    const [heureDebut, heureFin] = choix.split('-').map(Number);
    this.conversationState.data.heureDebut = heureDebut;
    this.conversationState.data.heureFin = heureFin;
    this.conversationState.etape = 'reservation_salle';
    const batiment = this.conversationState.data.batiment;
    let sallesDisponibles = this.salles;
    if (batiment === 'annexe') sallesDisponibles = this.salles.filter(s => s.batiment === 'Bâtiment Annexe');
    else if (batiment === 'principal') sallesDisponibles = this.salles.filter(s => s.batiment === 'Bâtiment Principal');
    const suggestions = sallesDisponibles.slice(0, 5);
    this.envoyerMessageBot(
      `Créneau : **${heureDebut}h - ${heureFin}h**\n\n**Étape 4/4 :** Voici les salles :\n\n` +
      suggestions.map((s, i) => `${i + 1}. **${s.nom}** (${s.capacite} places) - ${s.batiment}`).join('\n') +
      "\n\n💡 *Tapez le numéro ou le nom*",
      [{ label: '🔗 Voir toutes les salles', type: 'link', data: '/enseignant/reservation-salle' }]
    );
    this.conversationState.data.sallesDisponibles = suggestions;
  }

  private traiterChoixSalle(choix: string): void {
    const suggestions: Salle[] = this.conversationState.data.sallesDisponibles || [];
    let salle: Salle | undefined;
    const numero = parseInt(choix);
    if (!isNaN(numero) && numero >= 1 && numero <= suggestions.length) {
      salle = suggestions[numero - 1];
    } else {
      salle = suggestions.find(s => s.nom.toLowerCase().includes(choix.toLowerCase()));
    }
    if (salle) {
      this.conversationState.data.salleSelectionnee = salle;
      this.conversationState.etape = 'reservation_motif';
      this.envoyerMessageBot(`📍 Salle **${salle.nom}** sélectionnée.\n\nQuel est le **motif** de votre réservation ?`);
    } else {
      this.envoyerMessageBot("❌ Salle introuvable. Tapez le numéro ou le nom.");
    }
  }

  private traiterChoixMotif(texte: string): void {
    if (texte.length < 3) { this.envoyerMessageBot("Veuillez donner un motif plus explicite."); return; }
    this.conversationState.data.motif = texte;
    const data = this.conversationState.data;
    const salle = data.salleSelectionnee!;
    this.conversationState.etape = 'accueil';
    this.envoyerMessageBot(
      `✅ **Récapitulatif :**\n\n🏢 **Salle :** ${salle.nom}\n📅 **Date :** ${data.date?.toLocaleDateString('fr-FR')}\n🕐 **Horaire :** ${data.heureDebut}h - ${data.heureFin}h\n📝 **Motif :** ${texte}\n\nConfirmer ?`,
      [
        { label: '✅ Confirmer', type: 'function', data: 'finaliser' },
        { label: '🔄 Recommencer', type: 'function', data: 'reserver' }
      ]
    );
  }

  private finaliserReservation(): void {
    const data = this.conversationState.data;
    if (!data.salleSelectionnee || !data.date || !data.heureDebut || !data.heureFin || !data.motif) {
      this.envoyerMessageBot("⚠️ Informations manquantes.");
      return;
    }
    const date = data.date;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const reservationDto = {
      salleId: data.salleSelectionnee.id,
      dateDebut: `${dateStr}T${String(data.heureDebut).padStart(2, '0')}:00:00`,
      dateFin: `${dateStr}T${String(data.heureFin).padStart(2, '0')}:00:00`,
      motif: data.motif,
      nombreParticipants: data.salleSelectionnee.capacite
    };
    this.reservationService.creerReservation(reservationDto).subscribe({
      next: () => {
        this.envoyerMessageBot("🎉 Réservation enregistrée avec succès !");
        setTimeout(() => { this.router.navigate(['/enseignant/mes-reservations']); }, 2000);
      },
      error: () => {
        this.envoyerMessageBot("❌ Erreur lors de l'enregistrement.",
          [{ label: '📝 Formulaire manuel', type: 'link', data: '/enseignant/reservation-salle' }]);
      }
    });
  }

  private afficherAide(): void {
    this.envoyerMessageBot(
      "📚 **Guide CampusHub**\n\n✅ Réserver une salle\n✅ Voir réservations\n✅ Calendrier",
      [{ label: '📅 Réserver', type: 'function', data: 'reserver' }]
    );
  }

  private afficherMesReservations(): void {
    this.envoyerMessageBot("📋 Vos réservations :",
      [{ label: '📋 Mes réservations', type: 'link', data: '/enseignant/mes-reservations' }]);
  }

  private afficherCalendrier(): void {
    this.envoyerMessageBot("📅 Votre calendrier :",
      [{ label: '📅 Calendrier', type: 'link', data: '/enseignant/calendrier' }]);
  }

  private afficherSallesDisponibles(): void {
    const sallesLibres = this.salles.filter(s => s.disponible);
    this.envoyerMessageBot(`🟢 **${sallesLibres.length} salles disponibles** sur ${this.salles.length}`,
      [{ label: '📅 Réserver', type: 'function', data: 'reserver' }]);
  }

  private afficherSallesAnnexe(): void {
    this.envoyerMessageBot("💻 **Bâtiment Annexe** — Salle MAC, LABO, Polyvalente, Salles 20-37",
      [{ label: '✅ Réserver (Annexe)', type: 'function', data: 'reserver' }]);
  }

  private afficherSallesPrincipal(): void {
    this.envoyerMessageBot("🏭 **Bâtiment Principal** — Amphithéâtre, Salles P20-P47",
      [{ label: '✅ Réserver (Principal)', type: 'function', data: 'reserver' }]);
  }

  private afficherInfoAmphi(): void {
    const amphi = this.salles.find(s => s.nom === 'Amphithéâtre Principal');
    if (amphi) {
      this.envoyerMessageBot(`🎭 **Amphithéâtre** — ${amphi.capacite} places`,
        [{ label: '📅 Réserver', type: 'function', data: 'reserver' }]);
    }
  }

  private afficherInfoLabo(): void {
    const labo = this.salles.find(s => s.nom === 'LABO Informatique');
    if (labo) {
      this.envoyerMessageBot(`💻 **LABO Informatique** — ${labo.capacite} places`,
        [{ label: '📅 Réserver', type: 'function', data: 'reserver' }]);
    }
  }

  private repondreGentiment(): void {
    this.envoyerMessageBot("😊 Avec plaisir ! N'hésitez pas si vous avez d'autres questions.");
  }

  private saluer(): void {
    const h = new Date().getHours();
    const s = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
    this.envoyerMessageBot(`${s} ! 👋\n\nComment puis-je vous aider ?`,
      [{ label: '📅 Réserver', type: 'function', data: 'reserver' }]);
  }

  private repondrePasCompris(): void {
    this.envoyerMessageBot("🤔 Je n'ai pas compris. Essayez : réserver, aide, calendrier...",
      [{ label: '❓ Aide', type: 'function', data: 'aide' }]);
  }

  reinitialiser(): void {
    this.messagesSubject.next([]);
    this.conversationState = { etape: 'accueil', data: {} };
    this.envoyerMessageBotImmediat(
      "👋 Bonjour ! Je suis **Claude**, votre assistant ENICarthage.\n\nComment puis-je vous aider ?",
      [
        { label: '📅 Réserver une salle', type: 'function', data: 'reserver' },
        { label: '📋 Mes réservations', type: 'link', data: '/enseignant/mes-reservations' },
        { label: '📅 Calendrier', type: 'link', data: '/enseignant/calendrier' },
        { label: '❓ Aide', type: 'function', data: 'aide' }
      ]
    );
  }
  executerAction(action: Action): void {
    console.log('ChatbotEnseignant: Execution action...', action.data);
    if (action.type === 'function') {
      switch (action.data) {
        case 'reserver': this.demarrerReservation(); break;
        case 'aide': this.afficherAide(); break;
        case 'accueil': this.saluer(); break;
        case 'annexe': case 'principal': case 'tous': this.traiterChoixBatiment(action.data); break;
        case 'aujourdhui': case 'demain': case 'lundi': this.traiterChoixDate(action.data); break;
        case 'finaliser': this.finaliserReservation(); break;
        default: if (action.data.includes('-')) this.traiterChoixHeure(action.data);
      }
    }
  }
}

interface ConversationData {
  batiment?: string;
  date?: Date;
  heureDebut?: number;
  heureFin?: number;
  sallesDisponibles?: Salle[];
  salleSelectionnee?: Salle;
  motif?: string;
}

interface ConversationState {
  etape: string;
  data: ConversationData;
}