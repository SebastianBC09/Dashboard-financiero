import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SummaryCardVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error';

export interface SummaryCardData {
  title: string;
  amount: string | number;
  label?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary-card summary-card--{{ variant }}">
      <div class="summary-card__content">
        <h2 class="summary-card__title">{{ data.title }}</h2>
        <p class="summary-card__amount" [attr.aria-label]="getAriaLabel()">
          {{ formatAmount(data.amount) }}
        </p>
        <span class="summary-card__label" *ngIf="data.label">{{
          data.label
        }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .summary-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
          transform var(--transition-normal),
          box-shadow var(--transition-normal);
        position: relative;
        overflow: hidden;
        text-align: center;
      }

      .summary-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .summary-card__content {
        width: 100%;
      }

      .summary-card__title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin: 0 0 var(--spacing-xs);
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .summary-card__amount {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--spacing-xs);
        line-height: var(--line-height-tight);
      }

      .summary-card__label {
        font-size: var(--font-size-xs);
        opacity: 0.8;
        font-weight: var(--font-weight-medium);
      }

      /* Variants */
      .summary-card--primary {
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--primary-light) 100%
        );
      }

      .summary-card--secondary {
        background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
      }

      .summary-card--accent {
        background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
      }

      .summary-card--success {
        background: linear-gradient(
          135deg,
          var(--success-color) 0%,
          #48bb78 100%
        );
      }

      .summary-card--warning {
        background: linear-gradient(
          135deg,
          var(--warning-color) 0%,
          #ed8936 100%
        );
      }

      .summary-card--error {
        background: linear-gradient(
          135deg,
          var(--error-color) 0%,
          #f56565 100%
        );
      }

      /* Responsive */
      @media (max-width: 768px) {
        .summary-card {
          padding: var(--spacing-lg);
        }

        .summary-card__amount {
          font-size: var(--font-size-2xl);
        }

        .summary-card__icon {
          width: 40px;
          height: 40px;
          margin-left: var(--spacing-md);
        }

        .summary-card__icon svg {
          width: 20px;
          height: 20px;
        }
      }
    `,
  ],
})
export class SummaryCardComponent {
  @Input() data!: SummaryCardData;
  @Input() variant: SummaryCardVariant = 'primary';

  formatAmount(amount: string | number): string {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return amount;
  }

  getAriaLabel(): string {
    const amount = this.formatAmount(this.data.amount);
    return `${this.data.title}: ${amount}`;
  }
}
