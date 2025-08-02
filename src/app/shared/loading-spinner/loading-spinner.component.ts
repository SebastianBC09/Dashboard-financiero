import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerState =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'fintech';
export type SpinnerMode = 'default' | 'overlay';

export interface LoadingSpinnerConfig {
  size?: SpinnerSize;
  state?: SpinnerState;
  mode?: SpinnerMode;
  message?: string;
  subtitle?: string;
  showProgress?: boolean;
  showSubtitle?: boolean;
  progressValue?: number;
  progressMax?: number;
  ariaLabel?: string;
}

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  @Input() size: SpinnerSize = 'medium';
  @Input() state: SpinnerState = 'primary';
  @Input() mode: SpinnerMode = 'default';
  @Input() message: string = 'Cargando...';
  @Input() subtitle: string = 'Por favor espere';
  @Input() showProgress: boolean = false;
  @Input() showSubtitle: boolean = true;
  @Input() progressValue: number = 0;
  @Input() progressMax: number = 100;
  @Input() ariaLabel: string = 'Cargando contenido';
  @Input() config?: LoadingSpinnerConfig;

  private progressInterval?: number;

  ngOnInit(): void {
    this.applyConfig();
    this.startProgressAnimation();
  }

  ngOnDestroy(): void {
    this.stopProgressAnimation();
  }

  private applyConfig(): void {
    if (this.config) {
      this.size = this.config.size ?? this.size;
      this.state = this.config.state ?? this.state;
      this.mode = this.config.mode ?? this.mode;
      this.message = this.config.message ?? this.message;
      this.subtitle = this.config.subtitle ?? this.subtitle;
      this.showProgress = this.config.showProgress ?? this.showProgress;
      this.showSubtitle = this.config.showSubtitle ?? this.showSubtitle;
      this.progressValue = this.config.progressValue ?? this.progressValue;
      this.progressMax = this.config.progressMax ?? this.progressMax;
      this.ariaLabel = this.config.ariaLabel ?? this.ariaLabel;
    }
  }

  private startProgressAnimation(): void {
    if (this.showProgress && this.progressValue === 0) {
      this.progressInterval = window.setInterval(() => {
        this.progressValue = Math.min(
          this.progressValue + Math.random() * 10,
          90,
        );
      }, 500);
    }
  }

  private stopProgressAnimation(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  get progressPercentage(): number {
    return (this.progressValue / this.progressMax) * 100;
  }

  get containerClasses(): string {
    const classes = ['loading-spinner'];

    if (this.size !== 'medium') {
      classes.push(`loading-spinner--${this.size}`);
    }

    if (this.mode === 'overlay') {
      classes.push('loading-spinner--overlay');
    }

    return classes.join(' ');
  }

  get spinnerClasses(): string {
    const classes = ['spinner'];

    if (this.size !== 'medium') {
      classes.push(`spinner--${this.size}`);
    }

    if (this.state !== 'primary') {
      classes.push(`spinner--${this.state}`);
    }

    return classes.join(' ');
  }

  get messageClasses(): string {
    const classes = ['loading-message'];

    if (this.size !== 'medium') {
      classes.push(`loading-message--${this.size}`);
    }

    return classes.join(' ');
  }

  get subtitleClasses(): string {
    const classes = ['loading-subtitle'];

    if (!this.showSubtitle) {
      classes.push('loading-subtitle--hidden');
    }

    return classes.join(' ');
  }

  get progressClasses(): string {
    const classes = ['loading-progress'];

    if (!this.showProgress) {
      classes.push('loading-progress--hidden');
    }

    return classes.join(' ');
  }
}
