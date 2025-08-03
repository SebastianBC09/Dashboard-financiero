import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type ProductCardVariant = 'primary' | 'secondary' | 'accent';

export interface ProductCardData {
  title: string;
  description: string;
  icon: string;
  features: string[];
  variant?: ProductCardVariant;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <article class="product-card">
      <div class="product-card__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <ng-container [ngSwitch]="data.icon">
            <!-- Credit card icon -->
            <path
              *ngSwitchCase="'credit-card'"
              d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
            />

            <!-- Money icon -->
            <path
              *ngSwitchCase="'money'"
              d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
            />

            <!-- Home icon -->
            <path
              *ngSwitchCase="'home'"
              d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
            />

            <!-- Car icon -->
            <path
              *ngSwitchCase="'car'"
              d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
            />

            <!-- Chart icon -->
            <path
              *ngSwitchCase="'chart'"
              d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"
            />

            <!-- Default icon -->
            <path
              *ngSwitchDefault
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </ng-container>
        </svg>
      </div>

      <div class="product-card__content">
        <h3 class="product-card__title">{{ data.title }}</h3>
        <p class="product-card__description">{{ data.description }}</p>
        <ul
          class="product-card__features"
          aria-label="Características del producto"
        >
          <li *ngFor="let feature of data.features">{{ feature }}</li>
        </ul>
      </div>

      <div class="product-card__action">
        <app-button [variant]="getButtonVariant()" (click)="onLearnMore.emit()">
          Más información
        </app-button>
      </div>
    </article>
  `,
  styles: [
    `
      .product-card {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        background: var(--background);
        transition: all var(--transition-normal);
        display: flex;
        flex-direction: column;
      }

      .product-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-4px);
        border-color: var(--accent-color);
      }

      .product-card__icon {
        width: 56px;
        height: 56px;
        background: linear-gradient(
          135deg,
          var(--accent-color),
          var(--primary-light)
        );
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-lg);
        color: white;
      }

      .product-card__icon svg {
        width: 28px;
        height: 28px;
      }

      .product-card__content {
        flex: 1;
        margin-bottom: var(--spacing-lg);
      }

      .product-card__title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-md);
      }

      .product-card__description {
        font-size: var(--font-size-base);
        color: var(--text-secondary);
        line-height: var(--line-height-normal);
        margin: 0 0 var(--spacing-lg);
      }

      .product-card__features {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .product-card__features li {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
        padding-left: var(--spacing-lg);
        position: relative;
      }

      .product-card__features li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--success-color);
        font-weight: var(--font-weight-semibold);
      }

      .product-card__features li:last-child {
        margin-bottom: 0;
      }

      .product-card__action {
        margin-top: auto;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .product-card {
          padding: var(--spacing-lg);
        }

        .product-card__title {
          font-size: var(--font-size-lg);
        }

        .product-card__icon {
          width: 48px;
          height: 48px;
        }

        .product-card__icon svg {
          width: 24px;
          height: 24px;
        }
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input() data!: ProductCardData;
  @Output() onLearnMore = new EventEmitter<void>();

  getButtonVariant(): 'primary' | 'secondary' | 'danger' | 'ghost' {
    switch (this.data.variant) {
      case 'primary':
        return 'primary';
      case 'accent':
        return 'primary';
      default:
        return 'secondary';
    }
  }
}
