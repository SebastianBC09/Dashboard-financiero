import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SessionWarningComponent } from './shared/session-warning/session-warning.component';
import {
  NavigationHeaderComponent,
  NavigationItem,
  UserProfile,
  NotificationItem,
} from './shared/navigation-header/navigation-header.component';
import { AuthenticationService } from './core/authentication.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    SessionWarningComponent,
    NavigationHeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Dashboard Financiero';

  showNavigationHeader = false;
  navigationItems: NavigationItem[] = [];
  userProfile?: UserProfile;
  notifications: NotificationItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.setupNavigationListener();
    this.setupAuthenticationListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupNavigationListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.updateNavigationVisibility();
      });
  }

  private setupAuthenticationListener(): void {
    this.authService.currentSession$
      .pipe(takeUntil(this.destroy$))
      .subscribe((session) => {
        this.updateNavigationVisibility();
      });
  }

  private updateNavigationVisibility(): void {
    const currentUrl = this.router.url;
    const isAuthenticated = this.authService.isUserAuthenticated();

    this.showNavigationHeader =
      isAuthenticated &&
      !currentUrl.includes('/login') &&
      !currentUrl.includes('/auth');

    if (this.showNavigationHeader) {
      this.loadNavigationData();
    } else {
      this.navigationItems = [];
      this.userProfile = undefined;
      this.notifications = [];
    }
  }

  private loadNavigationData(): void {
    this.loadNavigationItems();
    this.loadUserProfile();
    this.loadNotifications();
  }

  private loadNavigationItems(): void {
    this.navigationItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'loan-application',
        label: 'Solicitar Crédito',
        route: '/loan-application',
        icon: 'credit',
      },
      {
        id: 'credit-transactions',
        label: 'Transacciones de Crédito',
        route: '/credit-transactions',
        icon: 'transactions',
      },
    ];
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile = {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        avatar:
          currentUser.avatar ||
          `https://www.gravatar.com/avatar/${this.hashCode(currentUser.email)}?d=mp&s=200`,
      };
    }
  }

  private loadNotifications(): void {
    this.notifications = [
      {
        id: '1',
        title: 'Préstamo Aprobado',
        message: 'Tu solicitud de préstamo ha sido aprobada',
        type: 'success',
        timestamp: new Date(),
        isRead: false,
      },
      {
        id: '2',
        title: 'Pago Procesado',
        message: 'Tu pago ha sido procesado exitosamente',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
    ];
  }

  onNavigationClick(item: NavigationItem): void {
    this.router.navigate([item.route]);
  }

  onUserMenuClick(action: string): void {
    switch (action) {
      case 'profile':
        break;
      case 'settings':
        break;
      case 'logout':
        this.onLogout();
        break;
    }
  }

  onLogout(): void {
    this.authService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.router.navigate(['/login']);
      },
    });
  }

  onNotificationClick(notification: NotificationItem): void {
    notification.isRead = true;
  }

  private hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }
}
