import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import {
  SessionMonitorService,
  SessionWarning,
} from '../../core/session-monitor.service';
import { AuthenticationService } from '../../core/authentication.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-session-warning',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MessageComponent],
  templateUrl: './session-warning.component.html',
  styleUrl: './session-warning.component.scss',
})
export class SessionWarningComponent implements OnInit, OnDestroy {
  currentWarning: SessionWarning | null = null;
  private destroy$ = new Subject<void>();
  readonly circumference = 2 * Math.PI * 45;

  // FontAwesome icons
  faClock = faClock;
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private sessionMonitorService: SessionMonitorService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.sessionMonitorService.sessionWarning$
      .pipe(takeUntil(this.destroy$))
      .subscribe((warning) => {
        this.currentWarning = warning;
        if (!warning) {
          this.currentWarning = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  extendSession = (): void => {
    this.sessionMonitorService.extendSession().subscribe({
      next: () => {},
      error: (error) => {},
    });
  };

  dismissWarning = (): void => {
    this.sessionMonitorService.dismissWarning();
  };

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgressOffset(): number {
    if (!this.currentWarning) return 0;

    const totalTime = this.currentWarning.type === 'critical' ? 60 : 120;
    const progress = this.currentWarning.timeRemaining / totalTime;
    return this.circumference * (1 - progress);
  }
}
