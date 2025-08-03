import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, MessageComponent],
  template: `
    <div
      *ngIf="
        currentWarning &&
        currentWarning.timeRemaining > 0 &&
        authenticationService.isUserAuthenticated()
      "
      class="session-warning-overlay"
    >
      <div class="session-warning-modal">
        <app-message
          [type]="currentWarning.type === 'critical' ? 'error' : 'warning'"
          [message]="currentWarning.message"
          variant="modal"
          [showActions]="currentWarning.showExtendButton"
          [primaryActionText]="'Extender Sesión'"
          [secondaryActionText]="'Cerrar'"
          [primaryAction]="extendSession"
          [secondaryAction]="dismissWarning"
          class="session-warning-message"
        >
        </app-message>

        <div class="session-warning-timer">
          <div class="timer-circle">
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle
                class="timer-background"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                stroke-width="8"
              ></circle>
              <circle
                class="timer-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                [style.stroke-dasharray]="circumference"
                [style.stroke-dashoffset]="getProgressOffset()"
              ></circle>
            </svg>
            <div class="timer-text">
              {{ formatTime(currentWarning.timeRemaining) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .session-warning-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }

      .session-warning-modal {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .session-warning-message {
        margin-bottom: 1.5rem;
      }

      .session-warning-timer {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
      }

      .timer-circle {
        position: relative;
        width: 80px;
        height: 80px;
      }

      .timer-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .timer-background {
        color: #e2e8f0;
      }

      .timer-progress {
        color: #ef4444;
        transition: stroke-dashoffset 1s linear;
      }

      .timer-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.875rem;
        font-weight: 600;
        color: #1f2937;
      }

      .session-warning-modal:has(.message--error) .timer-progress {
        color: #dc2626;
      }

      .session-warning-modal:has(.message--warning) .timer-progress {
        color: #f59e0b;
      }
    `,
  ],
})
export class SessionWarningComponent implements OnInit, OnDestroy {
  currentWarning: SessionWarning | null = null;
  private destroy$ = new Subject<void>();
  readonly circumference = 2 * Math.PI * 45; // 2πr donde r = 45

  constructor(
    private sessionMonitorService: SessionMonitorService,
    public authenticationService: AuthenticationService,
  ) {
    // Verificación silenciosa de inyección
  }

  ngOnInit(): void {
    this.sessionMonitorService.sessionWarning$
      .pipe(takeUntil(this.destroy$))
      .subscribe((warning) => {
        this.currentWarning = warning;
        // Si no hay advertencia, asegurar que el modal se oculte
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
      next: () => {
        // La advertencia se ocultará automáticamente
      },
      error: (error) => {
        // Manejo silencioso de errores
      },
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

    const totalTime = this.currentWarning.type === 'critical' ? 60 : 120; // 1 min o 2 min
    const progress = this.currentWarning.timeRemaining / totalTime;
    return this.circumference * (1 - progress);
  }
}
