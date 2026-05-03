import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
  private location = inject(Location);
  private apiUrl = 'http://localhost:8082/api/v1/profile';

  saved = false;

  enseignant = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '+216 71 000 000',
    role: 'Enseignant',
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
      this.enseignant.prenom = user.prenom;
      this.enseignant.nom = user.nom;
      this.enseignant.email = user.email;
      this.cdr.detectChanges();
    }
  }

  saveProfile(): void {
    this.http.put(this.apiUrl, {
      prenom: this.enseignant.prenom,
      nom: this.enseignant.nom,
      email: this.enseignant.email,
      telephone: this.enseignant.telephone
    }).subscribe({
      next: () => {
        this.saved = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.saved = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => alert('❌ Erreur: ' + err.error)
    });
  }

  changePassword(): void {
    if (this.passwords.new !== this.passwords.confirm) return;
    this.http.put(`${this.apiUrl}/password`, {
      current: this.passwords.current,
      new: this.passwords.new
    }, { responseType: 'text' }).subscribe({
      next: (msg) => {
        alert('✅ ' + msg);
        this.passwords = { current: '', new: '', confirm: '' };
        this.cdr.detectChanges();
      },
      error: (err) => alert('❌ ' + err.error)
    });
  }

  goBack(): void {
    this.location.back();
  }

}