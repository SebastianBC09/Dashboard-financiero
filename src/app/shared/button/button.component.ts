import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
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
  @Input() icon?: IconDefinition;
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
      this.icon ? 'button--has-icon' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  get loadingText(): string {
    return 'Cargando...';
  }

  getIconSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'fa-sm';
      case 'large':
        return 'fa-xl';
      default:
        return 'fa-lg';
    }
  }

  onButtonClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
