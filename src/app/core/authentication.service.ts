import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/types';
import { UserCredentials, UserSession } from '../models/types/auth.interface';
import { MOCK_USERS } from '../data/mock/mock-data';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentSessionSubject = new BehaviorSubject<UserSession | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();
  private readonly mockUsers: User[] = MOCK_USERS;

  constructor() {
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
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return throwError(
        () =>
          new Error('Usuario no encontrado. Verifica tu correo electrónico.'),
      );
    }

    if (credentials.password.length < 6) {
      return throwError(
        () => new Error('La contraseña debe tener al menos 6 caracteres'),
      );
    }

    const sessionDuration = 5 * 60 * 1000;

    const session: UserSession = {
      user,
      token: this.generateMockToken(),
      expiresAt: new Date(Date.now() + sessionDuration),
    };

    return of(session).pipe(
      delay(1000),
      tap((session) => {
        this.setCurrentSession(session);
        this.saveSessionToStorage(session);
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
        const session: UserSession = JSON.parse(storedSession);
        session.expiresAt = new Date(session.expiresAt);
        session.user.dateOfBirth = new Date(session.user.dateOfBirth);
        session.user.employmentInfo.employmentStartDate = new Date(
          session.user.employmentInfo.employmentStartDate,
        );
        session.user.createdAt = new Date(session.user.createdAt);
        session.user.updatedAt = new Date(session.user.updatedAt);

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

  private removeSessionFromStorage(): void {
    try {
      localStorage.removeItem('financial-dashboard-session');
    } catch (error) {}
  }
}
