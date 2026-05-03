import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DemandeRequest {
    type: string;
    message?: string;
}

@Injectable({ providedIn: 'root' })
export class DemandeService {
    private apiUrl = `http://localhost:8082/api/requests`;

    constructor(private http: HttpClient) { }

    getMyRequests(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    createRequest(demande: DemandeRequest): Observable<any> {
        return this.http.post<any>(this.apiUrl, {
            type: demande.type,
            message: demande.message
        });
    }
}