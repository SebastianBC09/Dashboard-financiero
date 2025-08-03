import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() type: ButtonType = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() iconOnly: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Output() click = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [
      'button',
      `button--${this.variant}`,
      `button--${this.size}`,
      this.fullWidth ? 'button--full-width' : '',
      this.iconOnly ? 'button--icon-only' : '',
      this.loading ? 'button--loading' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  get loadingText(): string {
    return 'Cargando...';
  }

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
