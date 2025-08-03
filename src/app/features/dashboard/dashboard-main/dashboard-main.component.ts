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
import {
  NavigationHeaderComponent,
  NavigationItem,
  UserProfile,
  NotificationItem,
} from '../../../shared/navigation-header/navigation-header.component';
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
    NavigationHeaderComponent,
  ],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
  summaryCards: SummaryCardData[] = [];
  creditCards: CreditCardData[] = [];
  transactions: TransactionData[] = [];
  productCards: ProductCardData[] = [];

  // Navigation data
  navigationItems: NavigationItem[] = [];
  userProfile?: UserProfile;
  notifications: NotificationItem[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSummaryData();
    this.loadCreditData();
    this.loadTransactionData();
    this.loadProductData();
    this.loadNavigationData();
  }

  private loadSummaryData(): void {
    this.summaryCards = [
      {
        title: 'Deuda Total',
        amount: 2450000,
        label: 'COP',
        icon: 'money',
        trend: { value: -2.5, isPositive: false },
      },
      {
        title: 'Próximo Pago',
        amount: 125000,
        label: '15 Feb 2024',
        icon: 'calendar',
        trend: { value: 0, isPositive: true },
      },
      {
        title: 'Créditos Activos',
        amount: 3,
        label: 'Productos',
        icon: 'credit-card',
        trend: { value: 0, isPositive: true },
      },
    ];
  }

  private loadCreditData(): void {
    this.creditCards = [
      {
        title: 'Préstamo Hipotecario',
        number: '4521',
        type: 'mortgage',
        originalAmount: 2000000,
        pendingAmount: 1750000,
        nextPaymentDate: '2024-02-15',
        progressPercentage: 87,
      },
      {
        title: 'Préstamo de Coche',
        number: '8842',
        type: 'auto',
        originalAmount: 80000000,
        pendingAmount: 45000000,
        nextPaymentDate: '2024-02-20',
        progressPercentage: 56,
      },
      {
        title: 'Tarjeta de Crédito',
        number: '3357',
        type: 'credit',
        originalAmount: 5000000,
        pendingAmount: 1200000,
        nextPaymentDate: '2024-02-25',
        progressPercentage: 24,
      },
    ];
  }

  private loadTransactionData(): void {
    this.transactions = [
      {
        title: 'Pago Préstamo Hipotecario',
        description: 'Cuota mensual - Febrero 2024',
        amount: 125000,
        type: 'payment',
        date: '2024-02-01',
        isCredit: false,
      },
      {
        title: 'Desembolso Tarjeta de Crédito',
        description: 'Compra en línea - Amazon',
        amount: 89000,
        type: 'disbursement',
        date: '2024-01-28',
        isCredit: true,
      },
      {
        title: 'Pago Préstamo de Coche',
        description: 'Cuota mensual - Enero 2024',
        amount: 850000,
        type: 'payment',
        date: '2024-01-25',
        isCredit: false,
      },
      {
        title: 'Pago Tarjeta de Crédito',
        description: 'Pago mínimo - Enero 2024',
        amount: 45000,
        type: 'payment',
        date: '2024-01-20',
        isCredit: false,
      },
      {
        title: 'Desembolso Préstamo Personal',
        description: 'Solicitud aprobada #5521',
        amount: 2000000,
        type: 'disbursement',
        date: '2024-01-15',
        isCredit: true,
      },
    ];
  }

  private loadProductData(): void {
    this.productCards = [
      {
        title: 'Tarjeta de Crédito Premium',
        description:
          'Obtén hasta $10,000,000 en límite de crédito con beneficios exclusivos',
        icon: 'credit-card',
        features: [
          'Sin cuota de manejo el primer año',
          'Cashback del 2% en compras',
          'Acceso a salas VIP',
        ],
        variant: 'primary',
      },
      {
        title: 'Préstamo Personal',
        description:
          'Financiación rápida hasta $50,000,000 para tus proyectos personales',
        icon: 'money',
        features: [
          'Tasa desde 1.2% mensual',
          'Hasta 60 meses para pagar',
          'Aprobación en 24 horas',
        ],
        variant: 'secondary',
      },
      {
        title: 'Crédito Hipotecario',
        description:
          'Haz realidad el sueño de tu casa propia con nuestro crédito hipotecario',
        icon: 'home',
        features: [
          'Financia hasta el 80% del valor',
          'Plazo hasta 30 años',
          'Tasa fija o variable',
        ],
        variant: 'secondary',
      },
    ];
  }

  onViewAllCredits(): void {
    console.log('Ver todos los créditos');
    // Implementar navegación
  }

  onViewAllTransactions(): void {
    console.log('Ver todas las transacciones');
    // Implementar navegación
  }

  onProductLearnMore(): void {
    console.log('Más información del producto');
    // Implementar navegación
  }

  private loadNavigationData(): void {
    // Navigation items
    this.navigationItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'credits',
        label: 'Créditos',
        route: '/credits',
        icon: 'credit-card',
      },
      {
        id: 'transactions',
        label: 'Transacciones',
        route: '/transactions',
        icon: 'transactions',
      },
      {
        id: 'reports',
        label: 'Reportes',
        route: '/reports',
        icon: 'chart',
      },
    ];

    // User profile
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      this.userProfile = {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        avatar: currentUser.avatar,
      };
    }

    // Notifications
    this.notifications = [
      {
        id: '1',
        title: 'Pago próximo',
        message: 'Tu próximo pago vence en 3 días',
        type: 'warning',
        timestamp: new Date(),
        isRead: false,
      },
      {
        id: '2',
        title: 'Crédito aprobado',
        message: 'Tu solicitud de crédito ha sido aprobada',
        type: 'success',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
    ];
  }

  onNavigationClick(item: NavigationItem): void {
    console.log('Navegación a:', item.route);
    // Implementar navegación
  }

  onUserMenuClick(action: string): void {
    console.log('Acción de usuario:', action);
    switch (action) {
      case 'profile':
        // Navegar al perfil
        break;
      case 'settings':
        // Navegar a configuraciones
        break;
      case 'help':
        // Mostrar ayuda
        break;
    }
  }

  onLogout(): void {
    this.authenticationService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Navegar de todas formas
        this.router.navigate(['/login']);
      },
    });
  }

  onNotificationClick(notification: NotificationItem): void {
    console.log('Notificación clickeada:', notification);
    // Marcar como leída y navegar si es necesario
  }
}
