import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faDollarSign,
  faArrowUp,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import {
  CreditTransactionService,
  CreditTransactionFilters,
  CreditTransactionError,
} from '../../../core/credit-transaction.service';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../../models/types';
import { AuthenticationService } from '../../../core/authentication.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner';
import { MessageComponent } from '../../../shared/message';
import { ModalComponent } from '../../../shared/modal';
import { TransactionItemComponent } from '../../../shared/transaction-item';
import { SummaryCardComponent } from '../../../shared/summary-card';

@Component({
  selector: 'app-credit-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    LoadingSpinnerComponent,
    MessageComponent,
    ModalComponent,
    TransactionItemComponent,
    SummaryCardComponent,
  ],
  templateUrl: './credit-transaction-list.component.html',
  styleUrl: './credit-transaction-list.component.scss',
})
export class CreditTransactionListComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedFilter = 'all';
  showModal = false;
  selectedTransaction: Transaction | null = null;

  stats = {
    totalTransactions: 0,
    totalAmount: 0,
    averageAmount: 0,
    mostCommonCategory: '',
  };

  summaryCards: any[] = [];

  // FontAwesome icons
  faSearch = faSearch;
  faDollarSign = faDollarSign;
  faArrowUp = faArrowUp;
  faChevronRight = faChevronRight;

  private destroy$ = new Subject<void>();

  constructor(
    private creditTransactionService: CreditTransactionService,
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCreditTransactions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCreditTransactions(): void {
    this.loading = true;
    this.error = null;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.handleError('Usuario no autenticado');
      return;
    }

    const filters: CreditTransactionFilters = {
      userId: currentUser.id,
      limit: 20,
    };

    this.creditTransactionService
      .getCreditTransactions(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.filteredTransactions = transactions;
          this.loadStats(currentUser.id);
        },
        error: (error) => {
          this.handleError(this.getErrorMessage(error));
        },
      });
  }

  private loadStats(userId: string): void {
    this.creditTransactionService
      .getCreditTransactionStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.createSummaryCards();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
          this.handleError(this.getErrorMessage(error));
        },
      });
  }

  private createSummaryCards(): void {
    this.summaryCards = [
      {
        title: 'Total Transacciones',
        amount: this.stats.totalTransactions,
        label: 'transacciones',
        icon: 'dollar-sign',
      },
      {
        title: 'Monto Total',
        amount: this.stats.totalAmount,
        label: 'COP',
        icon: 'arrow-up',
      },
      {
        title: 'Promedio',
        amount: this.stats.averageAmount,
        label: 'COP',
        icon: 'search',
      },
      {
        title: 'Categoría Principal',
        amount: this.stats.mostCommonCategory,
        label: 'más común',
        icon: 'chevron-right',
      },
    ];
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof CreditTransactionError) {
      return `Error en transacciones: ${error.message}`;
    }

    if (error instanceof Error) {
      return `Error al cargar las transacciones: ${error.message}`;
    }

    return 'Error desconocido al cargar las transacciones';
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilters();
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.transactions;

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower),
      );
    }

    // Filtrar por tipo
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(
        (transaction) =>
          transaction.type === (this.selectedFilter as TransactionType),
      );
    }

    this.filteredTransactions = filtered;
  }

  openTransactionDetail(transaction: Transaction | null): void {
    if (transaction) {
      this.selectedTransaction = transaction;
      this.showModal = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTransaction = null;
  }

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id;
  }

  getTransactionTypeText(type: TransactionType): string {
    const types: Record<TransactionType, string> = {
      DEPOSIT: 'Depósito',
      WITHDRAWAL: 'Retiro',
      TRANSFER: 'Transferencia',
      PAYMENT: 'Pago',
      DISBURSEMENT: 'Desembolso',
      FEE: 'Comisión',
    };
    return types[type] || type;
  }

  getStatusText(status: TransactionStatus): string {
    const statuses: Record<TransactionStatus, string> = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completado',
      FAILED: 'Fallido',
      CANCELLED: 'Cancelado',
    };
    return statuses[status] || status;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  }

  getTransactionDisplayTitle(transaction: Transaction): string {
    // Extraer el título principal de la descripción
    const description = transaction.description;
    if (description.includes(' - ')) {
      return description.split(' - ')[0];
    }
    return description;
  }

  getTransactionDisplayDescription(transaction: Transaction): string {
    // Extraer la parte después del guión como descripción
    const description = transaction.description;
    if (description.includes(' - ')) {
      return description.split(' - ')[1];
    }
    // Si no hay guión, usar la categoría formateada
    return this.formatCategory(transaction.category);
  }

  private formatCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      CREDIT_CARD_PURCHASE: 'Compra con tarjeta',
      MORTGAGE: 'Hipoteca',
      AUTO_LOAN: 'Préstamo vehicular',
      PERSONAL_LOAN: 'Préstamo personal',
      UTILITY_PAYMENT: 'Pago de servicios',
      INSURANCE: 'Seguro',
      INVESTMENT: 'Inversión',
      SAVINGS: 'Ahorro',
    };

    return categoryMap[category] || category.replace(/_/g, ' ').toLowerCase();
  }
}
