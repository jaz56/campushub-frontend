import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotBaseService, Action } from '../../../shared/services/chatbot-base.service';

@Injectable({ providedIn: 'root' })
export class ChatbotEtudiant extends ChatbotBaseService {

    constructor(private router: Router) {
        super();
        this.envoyerMessageBotImmediat(
            "👋 Bonjour ! Je suis votre assistant étudiant ENICarthage.\n\n" +
            "Comment puis-je vous aider ?",
            [
                { label: '🎉 Voir les événements', type: 'link', data: '/etudiant/evenements' },
                { label: '🏛️ Voir les clubs', type: 'link', data: '/etudiant/clubs' },
                { label: '📋 Mes demandes', type: 'link', data: '/etudiant/mes-demandes' },
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
        if (texte.includes('événement') || texte.includes('evenement')) {
            this.afficherEvenements();
        } else if (texte.includes('club')) {
            this.afficherClubs();
        } else if (texte.includes('demande')) {
            this.afficherDemandes();
        } else if (texte.includes('aide') || texte.includes('help')) {
            this.afficherAide();
        } else if (texte.includes('bonjour') || texte.includes('salut')) {
            this.saluer();
        } else {
            this.repondrePasCompris();
        }
    }

    private afficherEvenements(): void {
        this.envoyerMessageBot(
            "🎉 **Événements disponibles**\n\n" +
            "Découvrez tous les événements approuvés et inscrivez-vous !",
            [{ label: '🎉 Voir les événements', type: 'link', data: '/etudiant/evenements' }]
        );
    }

    private afficherClubs(): void {
        this.envoyerMessageBot(
            "🏛️ **Clubs ENICarthage**\n\n" +
            "Rejoignez un club et participez à la vie associative !",
            [{ label: '🏛️ Voir les clubs', type: 'link', data: '/etudiant/clubs' }]
        );
    }

    private afficherDemandes(): void {
        this.envoyerMessageBot(
            "📋 **Mes demandes administratives**\n\n" +
            "Suivez l'état de vos demandes ou créez-en une nouvelle.",
            [{ label: '📋 Mes demandes', type: 'link', data: '/etudiant/mes-demandes' }]
        );
    }

    private afficherAide(): void {
        this.envoyerMessageBot(
            "❓ **Aide - Espace Étudiant**\n\n" +
            "Voici ce que je peux faire :\n\n" +
            "✅ Voir les événements approuvés\n" +
            "✅ Découvrir et rejoindre des clubs\n" +
            "✅ Suivre vos demandes administratives\n" +
            "✅ Accéder à votre tableau de bord",
            [
                { label: '🏠 Tableau de bord', type: 'link', data: '/etudiant/dashboard' },
                { label: '🎉 Événements', type: 'link', data: '/etudiant/evenements' }
            ]
        );
    }

    private saluer(): void {
        const h = new Date().getHours();
        const salutation = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
        this.envoyerMessageBot(
            `${salutation} ! 👋\n\nComment puis-je vous aider aujourd'hui ?`,
            [
                { label: '🎉 Événements', type: 'link', data: '/etudiant/evenements' },
                { label: '🏛️ Clubs', type: 'link', data: '/etudiant/clubs' }
            ]
        );
    }

    private repondrePasCompris(): void {
        this.envoyerMessageBot(
            "🤔 Je n'ai pas compris votre demande.\n\nEssayez : événements, clubs, demandes ou aide.",
            [
                { label: '🎉 Événements', type: 'link', data: '/etudiant/evenements' },
                { label: '🏛️ Clubs', type: 'link', data: '/etudiant/clubs' },
                { label: '❓ Aide', type: 'function', data: 'aide' }
            ]
        );
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

        this.envoyerMessageBotImmediat(
            "🔄 Conversation réinitialisée ! Comment puis-je vous aider ?",
            [
                { label: '🎉 Événements', type: 'link', data: '/etudiant/evenements' },
                { label: '🏛️ Clubs', type: 'link', data: '/etudiant/clubs' }
            ]
        );
    }
}