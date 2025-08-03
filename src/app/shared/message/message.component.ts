import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageType = 'error' | 'warning' | 'success' | 'info';
export type MessageVariant = 'inline' | 'toast' | 'modal';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
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

  get errorId(): string {
    return `message-${Math.random().toString(36).substring(2, 11)}`;
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
