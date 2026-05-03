import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  private router = inject(Router);
  currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    const role = this.currentUser?.roles?.[0];
    if (role === 'ADMIN') {
      this.router.navigate(['/admin/profile']);
    } else if (role === 'ENSEIGNANT') {
      this.router.navigate(['/enseignant/profile']);
    } else if (role === 'ETUDIANT') {
      this.router.navigate(['/etudiant/profile']);
    }
  }
}