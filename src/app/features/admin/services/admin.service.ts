import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdminStats {
    totalUsers: number;
    totalEvents: number;
    pendingEvents: number;
    pendingReservations: number;
    pendingDemandes: number;
    totalClubs: number;
}

export interface AdminEvent {
    id: number;
    titre: string;
    description: string;
    lieu: string;
    club: string;
    capacite: number;
    dateDebut: string;
    dateFin: string;
    statut: string;
    commentaireAdmin?: string;
}

export interface AdminReservation {
    id: number;
    salle: string;
    salleNom: string;
    batiment: string;
    demandeur: string;
    motif: string;
    dateDebut: string;
    dateFin: string;
    statut: string;
    commentaireAdmin?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
    }

    getPendingEvents(): Observable<AdminEvent[]> {
        return this.http.get<AdminEvent[]>(`${this.apiUrl}/events/pending`);
    }

    getAllEvents(): Observable<AdminEvent[]> {
        return this.http.get<AdminEvent[]>(`${this.apiUrl}/events`);
    }

    approuverEvent(id: number): Observable<AdminEvent> {
        return this.http.put<AdminEvent>(`${this.apiUrl}/events/${id}/approuver`, {});
    }

    rejeterEvent(id: number, commentaire: string): Observable<AdminEvent> {
        return this.http.put<AdminEvent>(`${this.apiUrl}/events/${id}/rejeter`, { commentaire });
    }

    getAllReservations(): Observable<AdminReservation[]> {
        return this.http.get<AdminReservation[]>(`${this.apiUrl}/reservations`);
    }

    approuverReservation(id: number): Observable<AdminReservation> {
        return this.http.put<AdminReservation>(`${this.apiUrl}/reservations/${id}/approuver`, {});
    }

    rejeterReservation(id: number, commentaire: string): Observable<AdminReservation> {
        return this.http.put<AdminReservation>(`${this.apiUrl}/reservations/${id}/rejeter`, { commentaire });
    }

    getAllClubs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/clubs`);
    }

    approuverClub(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/clubs/${id}/approuver`, {});
    }

    suspendreClub(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/clubs/${id}/suspendre`, {});
    }

    getAllDemandes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/demandes`);
    }

    approuverDemande(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/demandes/${id}/approuver`, {});
    }

    rejeterDemande(id: number, commentaire: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/demandes/${id}/rejeter`, { commentaire });
    }
    getToutesReservations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/reservations`);
    }
}