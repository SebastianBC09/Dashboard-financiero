import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faCreditCard,
  faMoneyBill,
  faHome,
  faCar,
  faChartLine,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
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
  imports: [CommonModule, FontAwesomeModule, ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() data!: ProductCardData;
  @Output() onLearnMore = new EventEmitter<void>();

  faCreditCard = faCreditCard;
  faMoneyBill = faMoneyBill;
  faHome = faHome;
  faCar = faCar;
  faChartLine = faChartLine;
  faCheck = faCheck;

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

  getIcon(): IconDefinition {
    switch (this.data.icon) {
      case 'credit-card':
        return this.faCreditCard;
      case 'money':
        return this.faMoneyBill;
      case 'home':
        return this.faHome;
      case 'car':
        return this.faCar;
      case 'chart':
        return this.faChartLine;
      default:
        return this.faCreditCard;
    }
  }
}
