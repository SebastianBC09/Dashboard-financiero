import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() size: ModalSize = 'medium';
  @Input() closeOnOverlayClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Input() showCloseButton: boolean = true;
  @Input() title?: string;
  @Input() preventScroll: boolean = true;

  @Output() close = new EventEmitter<void>();

  private originalBodyOverflow: string = '';

  ngOnInit(): void {
    if (this.preventScroll) {
      this.originalBodyOverflow = document.body.style.overflow;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.preventScroll) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.originalBodyOverflow;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.preventScroll && this.originalBodyOverflow) {
      document.body.style.overflow = this.originalBodyOverflow;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscape) {
      event.preventDefault();
      this.closeModal();
    }
  }

  get modalClasses(): string {
    const classes = [
      'modal',
      `modal--${this.size}`,
      this.isOpen ? 'modal--open' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  get overlayClasses(): string {
    const classes = [
      'modal__overlay',
      this.isOpen ? 'modal__overlay--open' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  get contentClasses(): string {
    const classes = [
      'modal__content',
      this.isOpen ? 'modal__content--open' : '',
    ];
    return classes.filter(Boolean).join(' ');
  }

  onOverlayClick(event: Event): void {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onCloseButtonClick(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.close.emit();
  }
}
