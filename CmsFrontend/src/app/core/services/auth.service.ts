import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, UserProfile } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiBaseUrl.replace(/\/api\/?$/, '')}/api/auth`;
  readonly currentUser = signal<UserProfile | null>(null);

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.authUrl}/login`, data).pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/logout`, {}).pipe(
      tap(() => this.currentUser.set(null)),
    );
  }
}
