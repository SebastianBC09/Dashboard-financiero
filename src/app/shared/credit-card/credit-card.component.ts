import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CreditCardType =
  | 'mortgage'
  | 'auto'
  | 'credit'
  | 'personal'
  | 'business';

export interface CreditCardData {
  title: string;
  number: string;
  type: CreditCardType;
  originalAmount: number;
  pendingAmount: number;
  nextPaymentDate: string;
  progressPercentage: number;
  isOverdue?: boolean;
}

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="credit-card" [class.credit-card--overdue]="data.isOverdue">
      <div class="credit-card__header">
        <div class="credit-card__info">
          <h3 class="credit-card__title">{{ data.title }}</h3>
          <p
            class="credit-card__number"
            [attr.aria-label]="'Producto número ' + data.number"
          >
            **** {{ data.number }}
          </p>
        </div>
        <div
          class="credit-card__type credit-card__type--{{ data.type }}"
          [attr.aria-label]="getTypeLabel()"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <ng-container [ngSwitch]="data.type">
              <!-- Home/Mortgage icon -->
              <path
                *ngSwitchCase="'mortgage'"
                d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
              />

              <!-- Car icon -->
              <path
                *ngSwitchCase="'auto'"
                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
              />

              <!-- Credit card icon -->
              <path
                *ngSwitchCase="'credit'"
                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
              />

              <!-- Personal loan icon -->
              <path
                *ngSwitchCase="'personal'"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />

              <!-- Business icon -->
              <path
                *ngSwitchCase="'business'"
                d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-2 14H6V6h12v12z"
              />
            </ng-container>
          </svg>
        </div>
      </div>

      <div class="credit-card__amounts">
        <div class="amount-item">
          <span class="amount-item__label">{{ getAmountLabel() }}</span>
          <span
            class="amount-item__value"
            [attr.aria-label]="formatAmount(data.originalAmount)"
          >
            {{ formatAmount(data.originalAmount) }}
          </span>
        </div>
        <div class="amount-item">
          <span class="amount-item__label">{{ getPendingLabel() }}</span>
          <span
            class="amount-item__value amount-item__value--pending"
            [attr.aria-label]="formatAmount(data.pendingAmount)"
          >
            {{ formatAmount(data.pendingAmount) }}
          </span>
        </div>
      </div>

      <div class="credit-card__footer">
        <div class="payment-info">
          <span class="payment-info__label">{{ getPaymentLabel() }}:</span>
          <time
            class="payment-info__date"
            [attr.datetime]="data.nextPaymentDate"
          >
            {{ formatDate(data.nextPaymentDate) }}
          </time>
        </div>
        <div
          class="progress-bar"
          [attr.aria-label]="data.progressPercentage + '% pagado'"
        >
          <div
            class="progress-bar__fill"
            [class.progress-bar__fill--warning]="data.progressPercentage > 80"
            [style.width.%]="data.progressPercentage"
          ></div>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .credit-card {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        background: var(--background);
        transition: all var(--transition-normal);
      }

      .credit-card:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--accent-color);
      }

      .credit-card--overdue {
        border-color: var(--error-color);
        background: rgba(229, 62, 62, 0.02);
      }

      .credit-card__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: var(--spacing-lg);
      }

      .credit-card__info {
        flex: 1;
      }

      .credit-card__title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs);
      }

      .credit-card__number {
        font-size: var(--font-size-sm);
        color: var(--text-muted);
        margin: 0;
        font-family: 'Courier New', monospace;
      }

      .credit-card__type {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .credit-card__type svg {
        width: 20px;
        height: 20px;
      }

      .credit-card__type--mortgage {
        background: rgba(56, 161, 105, 0.1);
        color: var(--success-color);
      }

      .credit-card__type--auto {
        background: rgba(49, 130, 206, 0.1);
        color: var(--accent-color);
      }

      .credit-card__type--credit {
        background: rgba(214, 158, 46, 0.1);
        color: var(--warning-color);
      }

      .credit-card__type--personal {
        background: rgba(128, 90, 213, 0.1);
        color: #805ad5;
      }

      .credit-card__type--business {
        background: rgba(237, 137, 54, 0.1);
        color: #ed8936;
      }

      .credit-card__amounts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
      }

      .credit-card__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-lg);
      }

      .amount-item__label {
        display: block;
        font-size: var(--font-size-xs);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--spacing-xs);
        font-weight: var(--font-weight-medium);
      }

      .amount-item__value {
        display: block;
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
      }

      .amount-item__value--pending {
        color: var(--warning-color);
      }

      .payment-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .payment-info__label {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
      }

      .payment-info__date {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }

      .progress-bar {
        width: 120px;
        height: 6px;
        background: var(--background-tertiary);
        border-radius: 3px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .progress-bar__fill {
        height: 100%;
        background: var(--success-color);
        border-radius: 3px;
        transition: width var(--transition-slow);
      }

      .progress-bar__fill--warning {
        background: var(--warning-color);
      }

      /* Responsive */
      @media (max-width: 640px) {
        .credit-card__amounts {
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
        }

        .credit-card__footer {
          flex-direction: column;
          align-items: flex-start;
        }

        .progress-bar {
          width: 100%;
        }
      }
    `,
  ],
})
export class CreditCardComponent {
  @Input() data!: CreditCardData;

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  getTypeLabel(): string {
    const labels = {
      mortgage: 'Hipoteca',
      auto: 'Vehículo',
      credit: 'Tarjeta de crédito',
      personal: 'Préstamo personal',
      business: 'Préstamo empresarial',
    };
    return labels[this.data.type] || 'Crédito';
  }

  getAmountLabel(): string {
    const labels = {
      mortgage: 'Monto Original',
      auto: 'Monto Original',
      credit: 'Límite de Crédito',
      personal: 'Monto Original',
      business: 'Monto Original',
    };
    return labels[this.data.type] || 'Monto Original';
  }

  getPendingLabel(): string {
    const labels = {
      mortgage: 'Saldo Pendiente',
      auto: 'Saldo Pendiente',
      credit: 'Saldo Utilizado',
      personal: 'Saldo Pendiente',
      business: 'Saldo Pendiente',
    };
    return labels[this.data.type] || 'Saldo Pendiente';
  }

  getPaymentLabel(): string {
    const labels = {
      mortgage: 'Próximo pago',
      auto: 'Próximo pago',
      credit: 'Fecha de corte',
      personal: 'Próximo pago',
      business: 'Próximo pago',
    };
    return labels[this.data.type] || 'Próximo pago';
  }
}
