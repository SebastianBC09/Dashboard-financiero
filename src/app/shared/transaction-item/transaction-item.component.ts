import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TransactionType =
  | 'payment'
  | 'disbursement'
  | 'transfer'
  | 'withdrawal'
  | 'deposit';

export interface TransactionData {
  title: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  isCredit: boolean;
}

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="transaction-item">
      <div
        class="transaction-item__icon transaction-item__icon--{{ data.type }}"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <ng-container [ngSwitch]="data.type">
            <!-- Payment icon -->
            <path
              *ngSwitchCase="'payment'"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />

            <!-- Disbursement icon -->
            <path
              *ngSwitchCase="'disbursement'"
              d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z"
            />

            <!-- Transfer icon -->
            <path
              *ngSwitchCase="'transfer'"
              d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
            />

            <!-- Withdrawal icon -->
            <path
              *ngSwitchCase="'withdrawal'"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />

            <!-- Deposit icon -->
            <path
              *ngSwitchCase="'deposit'"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </ng-container>
        </svg>
      </div>

      <div class="transaction-item__content">
        <h3 class="transaction-item__title">{{ data.title }}</h3>
        <p class="transaction-item__description">{{ data.description }}</p>
        <time class="transaction-item__date" [attr.datetime]="data.date">
          {{ formatDate(data.date) }}
        </time>
      </div>

      <div class="transaction-item__amount">
        <span
          class="transaction-item__value"
          [class.transaction-item__value--credit]="data.isCredit"
          [class.transaction-item__value--debit]="!data.isCredit"
          [attr.aria-label]="getAriaLabel()"
        >
          {{ formatAmount(data.amount) }}
        </span>
        <span class="transaction-item__type">{{ getTypeLabel() }}</span>
      </div>
    </article>
  `,
  styles: [
    `
      .transaction-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        padding: var(--spacing-lg);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
      }

      .transaction-item:hover {
        background: var(--background-secondary);
        border-color: var(--border-color);
      }

      .transaction-item__icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .transaction-item__icon svg {
        width: 20px;
        height: 20px;
      }

      .transaction-item__icon--payment {
        background: rgba(56, 161, 105, 0.1);
        color: var(--success-color);
      }

      .transaction-item__icon--disbursement {
        background: rgba(49, 130, 206, 0.1);
        color: var(--accent-color);
      }

      .transaction-item__icon--transfer {
        background: rgba(128, 90, 213, 0.1);
        color: #805ad5;
      }

      .transaction-item__icon--withdrawal {
        background: rgba(237, 137, 54, 0.1);
        color: #ed8936;
      }

      .transaction-item__icon--deposit {
        background: rgba(56, 161, 105, 0.1);
        color: var(--success-color);
      }

      .transaction-item__content {
        flex: 1;
        min-width: 0;
      }

      .transaction-item__title {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs);
      }

      .transaction-item__description {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0 0 var(--spacing-xs);
      }

      .transaction-item__date {
        font-size: var(--font-size-xs);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .transaction-item__amount {
        text-align: right;
        flex-shrink: 0;
      }

      .transaction-item__value {
        display: block;
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        margin-bottom: var(--spacing-xs);
      }

      .transaction-item__value--debit {
        color: var(--error-color);
      }

      .transaction-item__value--credit {
        color: var(--success-color);
      }

      .transaction-item__type {
        display: block;
        font-size: var(--font-size-xs);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .transaction-item {
          gap: var(--spacing-md);
          padding: var(--spacing-md);
        }

        .transaction-item__amount {
          text-align: left;
        }
      }
    `,
  ],
})
export class TransactionItemComponent {
  @Input() data!: TransactionData;

  formatAmount(amount: number): string {
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return this.data.isCredit ? `+${formatted}` : `-${formatted}`;
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
      payment: 'Pago',
      disbursement: 'Desembolso',
      transfer: 'Transferencia',
      withdrawal: 'Retiro',
      deposit: 'Depósito',
    };
    return labels[this.data.type] || 'Transacción';
  }

  getAriaLabel(): string {
    const type = this.getTypeLabel();
    const amount = this.formatAmount(this.data.amount);
    return `${type} de ${amount}`;
  }
}
