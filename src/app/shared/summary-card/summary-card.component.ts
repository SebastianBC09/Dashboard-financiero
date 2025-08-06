import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDollarSign,
  faArrowUp,
  faSearch,
  faChevronRight,
  faCreditCard,
  faMoneyBill,
  faHome,
  faCalendar,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

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
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
})
export class SummaryCardComponent {
  @Input() data!: SummaryCardData;
  @Input() variant: SummaryCardVariant = 'primary';

  faDollarSign = faDollarSign;
  faArrowUp = faArrowUp;
  faSearch = faSearch;
  faChevronRight = faChevronRight;
  faCreditCard = faCreditCard;
  faMoneyBill = faMoneyBill;
  faHome = faHome;
  faCalendar = faCalendar;
  faChartLine = faChartLine;

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

  getIcon() {
    const iconMap: Record<string, typeof faDollarSign> = {
      'dollar-sign': this.faDollarSign,
      'arrow-up': this.faArrowUp,
      search: this.faSearch,
      'chevron-right': this.faChevronRight,
      'credit-card': this.faCreditCard,
      money: this.faMoneyBill,
      home: this.faHome,
      calendar: this.faCalendar,
      'chart-line': this.faChartLine,
    };

    return iconMap[this.data.icon || 'dollar-sign'] || this.faDollarSign;
  }
}
