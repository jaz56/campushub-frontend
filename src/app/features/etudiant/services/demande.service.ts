import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DemandeRequest {
  type: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) { }

  createRequest(demande: DemandeRequest): Observable<any> {
    return this.http.post<any>(`http://localhost:8082/api/requests`, demande);
  }

  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8082/api/requests`);
  }
}