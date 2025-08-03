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
  private dismissedWarnings = new Set<string>(); // Para recordar advertencias cerradas

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

    // Verificar inmediatamente al iniciar
    this.checkSessionStatus();

    // Verificar cada segundo para timer dinámico
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
      this.dismissedWarnings.clear(); // Limpiar advertencias cerradas al desautenticarse
      return;
    }

    const timeRemaining = this.authenticationService.getSessionTimeRemaining();

    // Si no hay tiempo restante, cerrar sesión automáticamente
    if (timeRemaining <= 0) {
      // Limpiar inmediatamente la advertencia
      this.sessionWarningSubject.next(null);
      // Limpiar advertencias cerradas
      this.dismissedWarnings.clear();
      // Detener el monitoreo
      this.stopMonitoring();

      // Cerrar sesión y redirigir usando Router
      this.authenticationService.logoutUser().subscribe({
        next: () => {
          // Usar Router para redirección limpia
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (error) => {
          // Redirigir de todas formas usando Router
          this.router.navigate(['/login'], { replaceUrl: true });
        },
      });
      return;
    }

    const minutesRemaining = Math.floor(timeRemaining / 60);
    const secondsRemaining = timeRemaining % 60;

    // Advertencia crítica: menos de 1 minuto (siempre se muestra)
    if (timeRemaining <= 60) {
      console.log('Showing critical warning, time remaining:', timeRemaining);
      this.sessionWarningSubject.next({
        type: 'critical',
        message: '¡Sesión crítica! Serás desconectado automáticamente.',
        timeRemaining,
        showExtendButton: true,
      });
    }
    // Advertencia: menos de 2 minutos (solo si no se ha cerrado antes)
    else if (timeRemaining <= 120 && !this.dismissedWarnings.has('warning')) {
      console.log(
        'Showing normal warning, time remaining:',
        timeRemaining,
        'dismissed:',
        this.dismissedWarnings.has('warning'),
      );
      this.sessionWarningSubject.next({
        type: 'warning',
        message: 'Tu sesión está por expirar. ¿Deseas extenderla?',
        timeRemaining,
        showExtendButton: true,
      });
    }
    // Sin advertencia
    else {
      if (timeRemaining > 120) {
        console.log('No warning needed, time remaining:', timeRemaining);
      } else {
        console.log(
          'Warning dismissed or not needed, time remaining:',
          timeRemaining,
          'dismissed:',
          this.dismissedWarnings.has('warning'),
        );
      }
      this.sessionWarningSubject.next(null);
    }
  }

  public extendSession(): Observable<void> {
    return new Observable((observer) => {
      this.authenticationService.extendSession().subscribe({
        next: () => {
          // Limpiar la advertencia inmediatamente y resetear las advertencias cerradas
          this.sessionWarningSubject.next(null);
          this.dismissedWarnings.clear();
          observer.next();
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  public dismissWarning(): void {
    const currentWarning = this.sessionWarningSubject.value;
    console.log('Dismissing warning:', currentWarning);

    if (currentWarning) {
      // Si es una advertencia normal, marcarla como cerrada
      if (currentWarning.type === 'warning') {
        console.log('Dismissing normal warning');
        this.dismissedWarnings.add('warning');
        this.sessionWarningSubject.next(null);
      }
      // Si es crítica, cerrar sesión automáticamente
      else if (currentWarning.type === 'critical') {
        console.log('Dismissing critical warning - logging out');
        // Primero detener el monitoreo para evitar más advertencias
        this.stopMonitoring();
        // Limpiar la advertencia
        this.sessionWarningSubject.next(null);
        // Limpiar advertencias cerradas
        this.dismissedWarnings.clear();

        this.authenticationService.logoutUser().subscribe({
          next: () => {
            this.router.navigate(['/login'], { replaceUrl: true });
          },
          error: () => {
            this.router.navigate(['/login'], { replaceUrl: true });
          },
        });
      }
    }
  }

  public getCurrentWarning(): SessionWarning | null {
    return this.sessionWarningSubject.value;
  }
}
