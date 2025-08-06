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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
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
  @Input() preventScroll: boolean = false;

  @Output() close = new EventEmitter<void>();

  faTimes = faTimes;

  private originalBodyOverflow: string = '';
  private originalBodyPosition: string = '';
  private originalBodyTop: string = '';
  private scrollY: number = 0;

  ngOnInit(): void {
    if (this.preventScroll) {
      this.originalBodyOverflow = document.body.style.overflow;
      this.originalBodyPosition = document.body.style.position;
      this.originalBodyTop = document.body.style.top;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.preventScroll) {
      if (this.isOpen) {
        this.scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = this.originalBodyOverflow;
        document.body.style.position = this.originalBodyPosition;
        document.body.style.top = this.originalBodyTop;
        document.body.style.width = '';
        window.scrollTo(0, this.scrollY);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.preventScroll) {
      document.body.style.overflow = this.originalBodyOverflow;
      document.body.style.position = this.originalBodyPosition;
      document.body.style.top = this.originalBodyTop;
      document.body.style.width = '';
      if (this.scrollY > 0) {
        window.scrollTo(0, this.scrollY);
      }
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
