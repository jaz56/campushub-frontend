import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  @Input() titre = '';
  @Input() sousTitre = '';
  @Input() showRetour = true;
  @Input() retourRoute = '/enseignant/dashboard';

  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}