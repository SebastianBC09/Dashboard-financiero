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

    // Suscribirse a cambios en la sesión para actualizar el perfil
    this.authenticationService.currentSession$.subscribe((session) => {
      if (session) {
        this.loadNavigationData();
      } else {
        // Si no hay sesión, limpiar los datos de navegación
        this.userProfile = undefined;
        this.navigationItems = [];
        this.notifications = [];
      }
    });
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
        title: 'Pago Vivienda',
        description: 'Cuota Dic 2024',
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
        description: 'Cuota Nov 2024',
        amount: 350000,
        type: 'payment',
        date: '2024-11-25',
        isCredit: false,
      },
      {
        title: 'Pago Tarjeta',
        description: 'Mínimo Nov 2024',
        amount: 50000,
        type: 'payment',
        date: '2024-11-20',
        isCredit: false,
      },
      {
        title: 'Pago Libre Inversión',
        description: 'Cuota Nov 2024',
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
