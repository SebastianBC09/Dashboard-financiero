import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  SummaryCardComponent,
  SummaryCardData,
} from '../../../shared/summary-card/summary-card.component';
import {
  CreditCardComponent,
  CreditCardData,
} from '../../../shared/credit-card/credit-card.component';
import {
  TransactionItemComponent,
  TransactionData,
} from '../../../shared/transaction-item/transaction-item.component';
import {
  ProductCardComponent,
  ProductCardData,
} from '../../../shared/product-card/product-card.component';
import { ButtonComponent } from '../../../shared/button/button.component';

import { AuthenticationService } from '../../../core/authentication.service';

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [
    CommonModule,
    SummaryCardComponent,
    CreditCardComponent,
    TransactionItemComponent,
    ProductCardComponent,
    ButtonComponent,
  ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  summaryCards: SummaryCardData[] = [];
  creditCards: CreditCardData[] = [];
  transactions: TransactionData[] = [];
  productCards: ProductCardData[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSummaryData();
    this.loadCreditData();
    this.loadTransactionData();
    this.loadProductData();
  }

  private loadSummaryData(): void {
    this.summaryCards = [
      {
        title: 'Deuda Total',
        amount: 182500000, // 125M + 35M + 2.5M + 20M
        label: 'COP',
        icon: 'money',
      },
      {
        title: 'Próximo Pago',
        amount: 1250000, // 800k + 350k + 50k + 50k
        label: '10 Dic',
        icon: 'calendar',
      },
      {
        title: 'Créditos Activos',
        amount: 4,
        label: 'Productos',
        icon: 'credit-card',
      },
    ];
  }

  private loadCreditData(): void {
    this.creditCards = [
      {
        title: 'Crédito de Vivienda',
        number: '4521',
        type: 'mortgage',
        originalAmount: 150000000,
        pendingAmount: 125000000,
        nextPaymentDate: '2024-12-15',
        progressPercentage: 83,
      },
      {
        title: 'Préstamo Vehicular',
        number: '8842',
        type: 'auto',
        originalAmount: 60000000,
        pendingAmount: 35000000,
        nextPaymentDate: '2024-12-20',
        progressPercentage: 58,
      },
      {
        title: 'Tarjeta de Crédito',
        number: '3357',
        type: 'credit',
        originalAmount: 8000000,
        pendingAmount: 2500000,
        nextPaymentDate: '2024-12-25',
        progressPercentage: 31,
      },
      {
        title: 'Préstamo Libre Inversión',
        number: '5521',
        type: 'personal',
        originalAmount: 25000000,
        pendingAmount: 20000000,
        nextPaymentDate: '2024-12-10',
        progressPercentage: 80,
      },
    ];
  }

  private loadTransactionData(): void {
    this.transactions = [
      {
        title: 'Pago Hipoteca',
        description: 'Cuota mensual',
        amount: 800000,
        type: 'payment',
        date: '2024-12-01',
        isCredit: false,
      },
      {
        title: 'Compra Tarjeta',
        description: 'Falabella',
        amount: 89000,
        type: 'disbursement',
        date: '2024-11-28',
        isCredit: true,
      },
      {
        title: 'Pago Vehicular',
        description: 'Cuota mensual',
        amount: 350000,
        type: 'payment',
        date: '2024-11-25',
        isCredit: false,
      },
      {
        title: 'Pago Tarjeta',
        description: 'Pago mínimo',
        amount: 50000,
        type: 'payment',
        date: '2024-11-20',
        isCredit: false,
      },
      {
        title: 'Pago Libre Inversión',
        description: 'Cuota mensual',
        amount: 500000,
        type: 'payment',
        date: '2024-11-15',
        isCredit: false,
      },
    ];
  }

  private loadProductData(): void {
    this.productCards = [
      {
        title: 'Tarjeta Premium',
        description: 'Hasta $10M de cupo con beneficios exclusivos',
        icon: 'credit-card',
        features: [
          'Sin cuota de manejo primer año',
          'Cashback 2%',
          'Salas VIP',
        ],
        variant: 'primary',
      },
      {
        title: 'Préstamo de Libre Inversión',
        description: 'Hasta $50M para tus proyectos',
        icon: 'money',
        features: ['Tasa desde 1.2%', 'Hasta 60 meses', 'Aprobación 24h'],
        variant: 'secondary',
      },
      {
        title: 'Crédito de Vivienda',
        description: 'Haz realidad tu casa propia',
        icon: 'home',
        features: ['Financia 80%', 'Hasta 30 años', 'Tasa fija/variable'],
        variant: 'secondary',
      },
    ];
  }

  onViewAllCredits(): void {}

  onViewAllTransactions(): void {}

  onProductLearnMore(): void {}
}
