import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
    id: string;
    texte: string;
    auteur: 'user' | 'bot';
    timestamp: Date;
    actions?: Action[];
}

export interface Action {
    label: string;
    type: 'link' | 'function';
    data?: any;
}

@Injectable()
export abstract class ChatbotBaseService {
    protected messagesSubject = new BehaviorSubject<Message[]>([]);
    public messages$ = this.messagesSubject.asObservable();

    abstract envoyerMessageUtilisateur(texte: string): void;
    abstract executerAction(action: Action): void;
    abstract reinitialiser(): void;

    protected envoyerMessageBot(texte: string, actions?: Action[]): void {
        setTimeout(() => {
            const message: Message = {
                id: Math.random().toString(36).substr(2, 9),
                texte,
                auteur: 'bot',
                timestamp: new Date(),
                actions
            };
            const messages = this.messagesSubject.value;
            this.messagesSubject.next([...messages, message]);
        }, 500);
    }
    protected envoyerMessageBotImmediat(texte: string, actions?: Action[]): void {
        const message: Message = {
            id: Math.random().toString(36).substr(2, 9),
            texte,
            auteur: 'bot',
            timestamp: new Date(),
            actions
        };
        const messages = this.messagesSubject.value;
        this.messagesSubject.next([...messages, message]);
    }
    public getMessages(): Message[] {
        return this.messagesSubject.value;
    }
}