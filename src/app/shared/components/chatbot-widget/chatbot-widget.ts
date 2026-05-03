import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatbotBaseService, Message, Action } from '../../services/chatbot-base.service';
import { MarkdownToHtmlPipe } from '../../pipes/markdown-to-html-pipe';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownToHtmlPipe],
  templateUrl: './chatbot-widget.html',
  styleUrls: ['./chatbot-widget.scss']
})
export class ChatbotWidget implements OnInit, OnDestroy, OnChanges {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @Input() chatbotService!: ChatbotBaseService;

  isOpen = false;
  isMinimized = false;
  messages: Message[] = [];
  messageInput = '';
  isTyping = false;

  private messagesSubscription?: Subscription;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    console.log('ChatbotWidget: Constructeur appelé');
  }

  ngOnInit(): void {
    console.log('ChatbotWidget: ngOnInit - Service présent ?', !!this.chatbotService);
    if (this.chatbotService) {
      this.initSubscription();
    }
  }

  ngOnChanges(changes: any): void {
    if (changes.chatbotService && changes.chatbotService.currentValue) {
      console.log('ChatbotWidget: ngOnChanges - Nouveau service reçu');
      this.initSubscription();
    }
  }



  private initSubscription(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }

    this.messagesSubscription = this.chatbotService.messages$.subscribe({
      next: (messages) => {
        this.messages = messages;
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });

    // Initialiser les messages au démarrage
    this.messages = this.chatbotService.getMessages();
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToBottom(), 100);
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.chatbotService) {
      this.isMinimized = false;

      // S'assurer que les messages sont à jour
      this.messages = this.chatbotService.getMessages();

      // Si aucune message, réinitialiser (envoie le message d'accueil)
      if (this.messages.length === 0) {
        this.chatbotService.reinitialiser();
      }

      this.cdr.detectChanges();
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  envoyerMessage(): void {
    if (!this.chatbotService || !this.messageInput.trim()) {
      console.warn('ChatbotWidget: Service non lié ou message vide');
      return;
    }

    console.log('ChatbotWidget: Envoi du message...', this.messageInput);
    this.chatbotService.envoyerMessageUtilisateur(this.messageInput);
    this.messageInput = '';
    this.cdr.detectChanges();
    this.simulateTyping();
  }

  executerAction(action: Action): void {
    if (!this.chatbotService) {
      console.error('ChatbotWidget: Service non lié pour executerAction');
      return;
    }

    console.log('ChatbotWidget: Execution action...', action);
    if (action.type === 'link') {
      this.router.navigate([action.data]);
      this.closeChat();
    } else if (action.type === 'function') {
      this.chatbotService.executerAction(action);
      this.simulateTyping();
    }
  }

  reinitialiser(): void {
    if (!this.chatbotService) return;
    if (confirm('Voulez-vous vraiment réinitialiser la conversation ?')) {
      console.log('ChatbotWidget: Réinitialisation...');
      this.chatbotService.reinitialiser();
    }
  }

  private simulateTyping(): void {
    this.isTyping = true;
    setTimeout(() => { this.isTyping = false; }, 1000);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerMessage();
    }
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}