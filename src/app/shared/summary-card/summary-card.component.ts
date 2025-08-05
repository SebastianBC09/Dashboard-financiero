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
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
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
