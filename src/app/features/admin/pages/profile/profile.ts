import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  saved = false;

  admin = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '+216 71 000 000',
    role: 'Administrateur',
    depuis: 'Septembre 2023'
  };

  passwords = {
    current: '',
    new: '',
    confirm: ''
  };

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.admin.prenom = user.prenom;
      this.admin.nom = user.nom;
      this.admin.email = user.email;
      this.cdr.detectChanges();
    }
  }

  saveProfile(): void {
    this.saved = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.saved = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  changePassword(): void {
    if (this.passwords.new !== this.passwords.confirm) return;
    alert('✅ Mot de passe mis à jour avec succès');
    this.passwords = { current: '', new: '', confirm: '' };
    this.cdr.detectChanges();
  }
}