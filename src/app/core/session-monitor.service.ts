import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export interface SessionWarning {
  type: 'warning' | 'critical';
  message: string;
  timeRemaining: number;
  showExtendButton: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SessionMonitorService implements OnDestroy {
  private sessionWarningSubject = new BehaviorSubject<SessionWarning | null>(
    null,
  );
  public sessionWarning$ = this.sessionWarningSubject.asObservable();

  private isMonitoring = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.startMonitoring();
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }

  private startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.checkSessionStatus();

    interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.authenticationService.isUserAuthenticated()),
      )
      .subscribe(() => {
        this.checkSessionStatus();
      });
  }

  private stopMonitoring(): void {
    this.isMonitoring = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkSessionStatus(): void {
    if (!this.authenticationService.isUserAuthenticated()) {
      this.sessionWarningSubject.next(null);
      return;
    }

    const timeRemaining = this.authenticationService.getSessionTimeRemaining();

    if (timeRemaining <= 0) {
      this.sessionWarningSubject.next(null);
      this.stopMonitoring();
      this.authenticationService.logoutUser().subscribe({
        next: () => this.router.navigate(['/login'], { replaceUrl: true }),
        error: () => this.router.navigate(['/login'], { replaceUrl: true }),
      });
      return;
    }

    if (timeRemaining <= 60) {
      this.sessionWarningSubject.next({
        type: 'critical',
        message: '¡Sesión crítica! Serás desconectado automáticamente.',
        timeRemaining,
        showExtendButton: true,
      });
    } else if (timeRemaining <= 120) {
      this.sessionWarningSubject.next({
        type: 'warning',
        message: 'Tu sesión está por expirar. ¿Deseas extenderla?',
        timeRemaining,
        showExtendButton: true,
      });
    } else {
      this.sessionWarningSubject.next(null);
    }
  }

  public extendSession(): Observable<void> {
    return new Observable((observer) => {
      this.authenticationService.extendSession().subscribe({
        next: () => {
          this.sessionWarningSubject.next(null);
          observer.next();
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  public dismissWarning(): void {
    const currentWarning = this.sessionWarningSubject.value;
    if (!currentWarning) return;

    if (currentWarning.type === 'warning') {
      this.sessionWarningSubject.next(null);
    } else if (currentWarning.type === 'critical') {
      this.stopMonitoring();
      this.sessionWarningSubject.next(null);
      this.authenticationService.logoutUser().subscribe({
        next: () => this.router.navigate(['/login'], { replaceUrl: true }),
        error: () => this.router.navigate(['/login'], { replaceUrl: true }),
      });
    }
  }

  public getCurrentWarning(): SessionWarning | null {
    return this.sessionWarningSubject.value;
  }
}
