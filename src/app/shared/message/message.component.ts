import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export type MessageType = 'error' | 'warning' | 'success' | 'info';
export type MessageVariant = 'inline' | 'toast' | 'modal';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  @Input() type: MessageType = 'info';
  @Input() variant: MessageVariant = 'inline';
  @Input() title?: string;
  @Input() message: string = '';
  @Input() details?: string;
  @Input() dismissible: boolean = false;
  @Input() showActions: boolean = false;
  @Input() primaryAction?: () => void;
  @Input() secondaryAction?: () => void;
  @Input() primaryActionText?: string;
  @Input() secondaryActionText?: string;
  @Input() compact: boolean = false;
  @Input() fullWidth: boolean = false;

  @Output() dismiss = new EventEmitter<void>();
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;
  faInfoCircle = faInfoCircle;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;

  private _errorId: string = '';

  ngOnInit(): void {
    this._errorId = `message-${Math.random().toString(36).substring(2, 11)}`;
  }

  get errorId(): string {
    return this._errorId;
  }

  get defaultPrimaryActionText(): string {
    switch (this.type) {
      case 'error':
        return 'Reintentar';
      case 'warning':
        return 'Continuar';
      case 'success':
        return 'Aceptar';
      case 'info':
        return 'Entendido';
      default:
        return 'Aceptar';
    }
  }

  get defaultSecondaryActionText(): string {
    return 'Cancelar';
  }

  onPrimaryAction(): void {
    if (this.primaryAction) {
      this.primaryAction();
    }
  }

  onSecondaryAction(): void {
    if (this.secondaryAction) {
      this.secondaryAction();
    }
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
