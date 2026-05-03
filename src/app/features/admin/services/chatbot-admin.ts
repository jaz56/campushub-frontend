import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotBaseService, Action } from '../../../shared/services/chatbot-base.service';

@Injectable({ providedIn: 'root' })
export class ChatbotAdmin extends ChatbotBaseService {

    constructor(private router: Router) {
        super();
        this.envoyerMessageBotImmediat(
            "👋 Bonjour Administrateur !\n\nJe suis votre assistant ENICarthage.\n\nComment puis-je vous aider ?",
            [
                { label: '📊 Dashboard', type: 'link', data: '/admin/dashboard' },
                { label: '📅 Réservations', type: 'link', data: '/admin/reservations' },
                { label: '🎉 Événements', type: 'link', data: '/admin/events' },
                { label: '👥 Utilisateurs', type: 'link', data: '/admin/users' },
                { label: '❓ Aide', type: 'function', data: 'aide' }
            ]
        );
    }

    envoyerMessageUtilisateur(texte: string): void {
        const message = {
            id: Math.random().toString(36).substr(2, 9),
            texte,
            auteur: 'user' as const,
            timestamp: new Date()
        };
        this.messagesSubject.next([...this.messagesSubject.value, message]);
        this.traiterMessage(texte.toLowerCase().trim());
    }

    private traiterMessage(texte: string): void {
        if (texte.includes('réservation') || texte.includes('reservation')) {
            this.afficherReservations();
        } else if (texte.includes('événement') || texte.includes('evenement')) {
            this.afficherEvenements();
        } else if (texte.includes('utilisateur') || texte.includes('user')) {
            this.afficherUtilisateurs();
        } else if (texte.includes('demande')) {
            this.afficherDemandes();
        } else if (texte.includes('club')) {
            this.afficherClubs();
        } else if (texte.includes('statistique') || texte.includes('stats')) {
            this.afficherStats();
        } else if (texte.includes('aide') || texte.includes('help')) {
            this.afficherAide();
        } else if (texte.includes('bonjour') || texte.includes('salut')) {
            this.saluer();
        } else {
            this.repondrePasCompris();
        }
    }

    private afficherReservations(): void {
        this.envoyerMessageBot("📅 **Réservations**\n\nApprouvez ou rejetez les demandes.",
            [{ label: '📅 Réservations', type: 'link', data: '/admin/reservations' }]);
    }

    private afficherEvenements(): void {
        this.envoyerMessageBot("🎉 **Événements**\n\nValidez les événements des clubs.",
            [{ label: '🎉 Événements', type: 'link', data: '/admin/events' }]);
    }

    private afficherUtilisateurs(): void {
        this.envoyerMessageBot("👥 **Utilisateurs**\n\nGérez les comptes.",
            [{ label: '👥 Utilisateurs', type: 'link', data: '/admin/users' }]);
    }

    private afficherDemandes(): void {
        this.envoyerMessageBot("📋 **Demandes**\n\nTraitez les demandes.",
            [{ label: '📋 Demandes', type: 'link', data: '/admin/demandes' }]);
    }

    private afficherClubs(): void {
        this.envoyerMessageBot("🏛️ **Clubs**\n\nApprouvez ou suspendez les clubs.",
            [{ label: '🏛️ Clubs', type: 'link', data: '/admin/clubs' }]);
    }

    private afficherStats(): void {
        this.envoyerMessageBot("📊 **Statistiques**",
            [{ label: '📊 Dashboard', type: 'link', data: '/admin/dashboard' }]);
    }

    private afficherAide(): void {
        this.envoyerMessageBot(
            "❓ **Aide Admin**\n\n✅ Réservations\n✅ Événements\n✅ Utilisateurs\n✅ Clubs\n✅ Demandes",
            [{ label: '📊 Dashboard', type: 'link', data: '/admin/dashboard' }]
        );
    }

    private saluer(): void {
        const h = new Date().getHours();
        const s = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
        this.envoyerMessageBot(`${s} Administrateur ! 👋\n\nComment puis-je vous aider ?`,
            [{ label: '📊 Dashboard', type: 'link', data: '/admin/dashboard' }]);
    }

    private repondrePasCompris(): void {
        this.envoyerMessageBot("🤔 Je n'ai pas compris. Essayez : réservations, événements, utilisateurs, clubs...",
            [{ label: '❓ Aide', type: 'function', data: 'aide' }]);
    }

    executerAction(action: Action): void {
        if (action.type === 'function') {
            switch (action.data) {
                case 'aide': this.afficherAide(); break;
                default: this.repondrePasCompris();
            }
        }
    }

    reinitialiser(): void {
        this.messagesSubject.next([]);
        this.envoyerMessageBotImmediat("🔄 Conversation réinitialisée !",
            [{ label: '📊 Dashboard', type: 'link', data: '/admin/dashboard' }]);
    }
}