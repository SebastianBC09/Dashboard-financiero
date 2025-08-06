import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/types';
import { UserCredentials, UserSession } from '../models/types/auth.interface';
import { MockHttpResponse } from '../data/types/mock-http.types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentSessionSubject = new BehaviorSubject<UserSession | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {
    this.loadSessionFromStorage();
    this.checkAndCleanExpiredSession();
  }

  private checkAndCleanExpiredSession(): void {
    const session = this.currentSessionSubject.value;
    if (session && session.expiresAt <= new Date()) {
      this.clearCurrentSession();
      this.removeSessionFromStorage();
    }
  }

  public authenticateUser(
    credentials: UserCredentials,
  ): Observable<UserSession> {
    if (credentials.password.length < 6) {
      return throwError(
        () => new Error('La contraseña debe tener al menos 6 caracteres'),
      );
    }

    return this.http
      .post<
        MockHttpResponse<{ user: User; token: string; expiresAt: Date }>
      >(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        map((response) => {
          const session: UserSession = {
            user: response.data.user,
            token: response.data.token,
            expiresAt: new Date(response.data.expiresAt),
          };
          return session;
        }),
        tap((session) => {
          this.setCurrentSession(session);
          this.saveSessionToStorage(session);
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.message || 'Error de autenticación'),
          );
        }),
      );
  }

  public logoutUser(): Observable<void> {
    return of(void 0).pipe(
      delay(100),
      tap(() => {
        this.clearCurrentSession();
        this.removeSessionFromStorage();
      }),
    );
  }

  public refreshUserSession(): Observable<UserSession | null> {
    const currentSession = this.currentSessionSubject.value;

    if (!currentSession) {
      return of(null);
    }

    if (currentSession.expiresAt < new Date()) {
      this.clearCurrentSession();
      this.removeSessionFromStorage();
      return of(null);
    }

    const sessionDuration = 5 * 60 * 1000;

    const refreshedSession: UserSession = {
      ...currentSession,
      token: this.generateMockToken(),
      expiresAt: new Date(Date.now() + sessionDuration),
    };

    return of(refreshedSession).pipe(
      delay(300),
      tap((session) => {
        this.setCurrentSession(session);
        this.saveSessionToStorage(session);
      }),
    );
  }

  public isUserAuthenticated(): boolean {
    const session = this.currentSessionSubject.value;
    return session !== null && session.expiresAt > new Date();
  }

  public isSessionExpiringSoon(warningMinutes: number = 5): boolean {
    const session = this.currentSessionSubject.value;
    if (!session) return false;

    const warningTime = new Date(Date.now() + warningMinutes * 60 * 1000);
    return session.expiresAt <= warningTime && session.expiresAt > new Date();
  }

  public getSessionTimeRemaining(): number {
    const session = this.currentSessionSubject.value;
    if (!session) return 0;

    const now = new Date();
    const timeRemaining = session.expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(timeRemaining / 1000));
  }

  public extendSession(): Observable<UserSession> {
    const currentSession = this.currentSessionSubject.value;

    if (!currentSession) {
      return throwError(() => new Error('No hay sesión activa para extender'));
    }

    const sessionDuration = 5 * 60 * 1000;

    const extendedSession: UserSession = {
      ...currentSession,
      token: this.generateMockToken(),
      expiresAt: new Date(Date.now() + sessionDuration),
    };

    return of(extendedSession).pipe(
      delay(300),
      tap((session) => {
        this.setCurrentSession(session);
        this.saveSessionToStorage(session);
      }),
    );
  }

  public getCurrentUser(): User | null {
    const session = this.currentSessionSubject.value;
    return session?.user || null;
  }

  private setCurrentSession(session: UserSession): void {
    this.currentSessionSubject.next(session);
  }

  private clearCurrentSession(): void {
    this.currentSessionSubject.next(null);
  }

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substring(2);
  }

  private saveSessionToStorage(session: UserSession): void {
    localStorage.setItem(
      'financial-dashboard-session',
      JSON.stringify(session),
    );
  }

  private loadSessionFromStorage(): void {
    const storedSession = localStorage.getItem('financial-dashboard-session');
    if (storedSession) {
      try {
        if (!this.isValidJson(storedSession)) {
          throw new Error('Invalid JSON format');
        }

        const session: UserSession = JSON.parse(storedSession);

        if (!this.isValidSessionStructure(session)) {
          throw new Error('Invalid session structure');
        }

        session.expiresAt = new Date(session.expiresAt);
        session.user.dateOfBirth = new Date(session.user.dateOfBirth);
        session.user.employmentInfo.employmentStartDate = new Date(
          session.user.employmentInfo.employmentStartDate,
        );
        session.user.createdAt = new Date(session.user.createdAt);
        session.user.updatedAt = new Date(session.user.updatedAt);

        if (isNaN(session.expiresAt.getTime())) {
          throw new Error('Invalid expiration date');
        }

        if (session.expiresAt > new Date()) {
          this.setCurrentSession(session);
        } else {
          this.removeSessionFromStorage();
        }
      } catch (error) {
        console.error('Error loading session from storage:', error);
        this.removeSessionFromStorage();
      }
    }
  }

  private isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  private isValidSessionStructure(session: unknown): session is UserSession {
    if (!session || typeof session !== 'object') {
      return false;
    }

    const sessionObj = session as Record<string, unknown>;

    if (!this.isValidUserStructure(sessionObj['user'])) {
      return false;
    }

    if (!sessionObj['token'] || typeof sessionObj['token'] !== 'string') {
      return false;
    }

    if (!sessionObj['expiresAt']) {
      return false;
    }

    return true;
  }

  private isValidUserStructure(user: unknown): user is User {
    if (!user || typeof user !== 'object') {
      return false;
    }

    const userObj = user as Record<string, unknown>;

    if (!userObj['email'] || typeof userObj['email'] !== 'string') {
      return false;
    }

    if (!userObj['name'] || typeof userObj['name'] !== 'string') {
      return false;
    }

    if (
      !userObj['employmentInfo'] ||
      typeof userObj['employmentInfo'] !== 'object'
    ) {
      return false;
    }

    return true;
  }

  private removeSessionFromStorage(): void {
    try {
      localStorage.removeItem('financial-dashboard-session');
    } catch (error) {}
  }
}
