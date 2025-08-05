import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faCreditCard,
  faMoneyBill,
  faExchangeAlt,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

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
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
})
export class TransactionItemComponent {
  @Input() data!: TransactionData;

  // FontAwesome icons
  faCreditCard = faCreditCard;
  faMoneyBill = faMoneyBill;
  faExchangeAlt = faExchangeAlt;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

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

  getIcon(): IconDefinition {
    switch (this.data.type) {
      case 'payment':
        return this.faCreditCard;
      case 'disbursement':
        return this.faMoneyBill;
      case 'transfer':
        return this.faExchangeAlt;
      case 'withdrawal':
        return this.faArrowDown;
      case 'deposit':
        return this.faArrowUp;
      default:
        return this.faCreditCard;
    }
  }
}
