import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../../../core/models/evenement';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = `http://localhost:8082/api/events`;

  constructor(private http: HttpClient) { }

  getApprovedEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.apiUrl);
  }

  registerForEvent(eventId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${eventId}/register`, {},
      { responseType: 'text' });
  }

  cancelRegistration(eventId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${eventId}/register`,
      { responseType: 'text' });
  }

  getMyRegistrations(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/my-registrations`);
  }

  isOpen(e: Evenement): boolean {
    return e.status === 'APPROVED';
  }

  isFull(e: Evenement): boolean {
    return e.status === 'REJECTED';
  }
}