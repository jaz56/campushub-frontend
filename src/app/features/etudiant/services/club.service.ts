import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club, ClubApplication } from '../../../core/models';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = 'http://localhost:8082/api/clubs';
  constructor(private http: HttpClient) { }

  // Student features
  getActiveClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);  // GET /api/v1/clubs
  }

  getClub(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  applyToClub(id: number, motivation: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/${id}/apply`,
      { motivation },
      { responseType: 'text' }
    );
  }

  getMyApplications(): Observable<ClubApplication[]> {
    return this.http.get<ClubApplication[]>(`${this.apiUrl}/my-applications`);
  }

  // Club head features (if you want to show them later)
  getApplicationsForMyClub(clubId: number): Observable<ClubApplication[]> {
    return this.http.get<ClubApplication[]>(`${this.apiUrl}/${clubId}/applications`);
  }
}