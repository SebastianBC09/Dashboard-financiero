import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  badge?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-navigation-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-header.component.html',
  styleUrl: './navigation-header.component.scss',
})
export class NavigationHeaderComponent implements OnInit, OnDestroy {
  @Input() appName: string = 'FinanceDash';
  @Input() navigationItems: NavigationItem[] = [];
  @Input() userProfile?: UserProfile;
  @Input() notifications: NotificationItem[] = [];
  @Input() showNotifications: boolean = true;
  @Input() showUserMenu: boolean = true;

  @Output() navigationClick = new EventEmitter<NavigationItem>();
  @Output() userMenuClick = new EventEmitter<string>();
  @Output() notificationClick = new EventEmitter<NotificationItem>();
  @Output() logoutClick = new EventEmitter<void>();

  // Estados internos
  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  unreadNotificationsCount: number = 0;

  // Referencias para click outside
  private userMenuElement?: HTMLElement;
  private notificationsElement?: HTMLElement;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUnreadNotificationsCount();
  }

  ngOnDestroy(): void {
    this.closeAllMenus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Cerrar menú de usuario si se hace click fuera
    if (this.userMenuElement && !this.userMenuElement.contains(target)) {
      this.closeUserMenu();
    }

    // Cerrar notificaciones si se hace click fuera
    if (
      this.notificationsElement &&
      !this.notificationsElement.contains(target)
    ) {
      this.closeNotifications();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Cerrar menú móvil en pantallas grandes
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private updateUnreadNotificationsCount(): void {
    this.unreadNotificationsCount = this.notifications.filter(
      (n) => !n.isRead,
    ).length;
  }

  // Métodos de navegación
  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item);
    this.closeMobileMenu();
  }

  isNavigationActive(item: NavigationItem): boolean {
    return this.router.url === item.route;
  }

  // Métodos del menú de usuario
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.closeNotifications();
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onUserMenuAction(action: string): void {
    this.userMenuClick.emit(action);
    this.closeUserMenu();
  }

  onLogout(): void {
    this.logoutClick.emit();
    this.closeUserMenu();
  }

  // Métodos de notificaciones
  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.closeUserMenu();
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }

  onNotificationClick(notification: NotificationItem): void {
    this.notificationClick.emit(notification);
    this.closeNotifications();
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach((n) => (n.isRead = true));
    this.updateUnreadNotificationsCount();
  }

  // Métodos del menú móvil
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Métodos de utilidad
  private closeAllMenus(): void {
    this.closeUserMenu();
    this.closeNotifications();
    this.closeMobileMenu();
  }

  // Getters para clases CSS
  get userMenuClasses(): string {
    const classes = ['navigation-header__user-dropdown'];

    if (this.isUserMenuOpen) {
      classes.push('navigation-header__user-dropdown--open');
    }

    return classes.join(' ');
  }

  get notificationsClasses(): string {
    const classes = ['navigation-header__notifications-dropdown'];

    if (this.isNotificationsOpen) {
      classes.push('navigation-header__notifications-dropdown--open');
    }

    return classes.join(' ');
  }

  get mobileMenuClasses(): string {
    const classes = ['navigation-header__mobile-nav'];

    if (this.isMobileMenuOpen) {
      classes.push('navigation-header__mobile-nav--open');
    }

    return classes.join(' ');
  }

  get mobileMenuButtonClasses(): string {
    const classes = ['navigation-header__mobile-menu-btn'];

    if (this.isMobileMenuOpen) {
      classes.push('navigation-header__mobile-menu-btn--open');
    }

    return classes.join(' ');
  }

  // Referencias para elementos del DOM
  setUserMenuRef(element: HTMLElement): void {
    this.userMenuElement = element;
  }

  setNotificationsRef(element: HTMLElement): void {
    this.notificationsElement = element;
  }
}
