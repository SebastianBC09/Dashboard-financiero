import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faCreditCard,
  faHome,
  faCar,
  faUser,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

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
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss',
})
export class CreditCardComponent {
  @Input() data!: CreditCardData;

  // FontAwesome icons
  faCreditCard = faCreditCard;
  faHome = faHome;
  faCar = faCar;
  faUser = faUser;
  faBuilding = faBuilding;

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

  getIcon(): IconDefinition {
    switch (this.data.type) {
      case 'mortgage':
        return this.faHome;
      case 'auto':
        return this.faCar;
      case 'credit':
        return this.faCreditCard;
      case 'personal':
        return this.faUser;
      case 'business':
        return this.faBuilding;
      default:
        return this.faCreditCard;
    }
  }
}
