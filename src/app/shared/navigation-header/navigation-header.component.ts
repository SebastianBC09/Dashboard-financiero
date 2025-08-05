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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faTachometerAlt,
  faExchangeAlt,
  faCreditCard,
  faBell,
  faCog,
  faSignOutAlt,
  faUser,
  faChevronDown,
  faBars,
  faTimes,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

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
  imports: [CommonModule, RouterModule, FontAwesomeModule],
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

  isUserMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  unreadNotificationsCount: number = 0;

  private userMenuElement?: HTMLElement;
  private notificationsElement?: HTMLElement;

  faTachometerAlt = faTachometerAlt;
  faExchangeAlt = faExchangeAlt;
  faCreditCard = faCreditCard;
  faBell = faBell;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  faChevronDown = faChevronDown;
  faBars = faBars;
  faTimes = faTimes;
  faChartLine = faChartLine;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUnreadNotificationsCount();
  }

  ngOnDestroy(): void {
    this.closeAllMenus();
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (this.userMenuElement && !this.userMenuElement.contains(target)) {
      this.closeUserMenu();
    }

    if (
      this.notificationsElement &&
      !this.notificationsElement.contains(target)
    ) {
      this.closeNotifications();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private updateUnreadNotificationsCount(): void {
    this.unreadNotificationsCount = this.notifications.filter(
      (n) => !n.isRead,
    ).length;
  }

  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item);
    this.closeMobileMenu();
  }

  onMobileNotificationClick(notification: NotificationItem): void {
    this.notificationClick.emit(notification);
    this.closeMobileMenu();
  }

  onMobileUserAction(action: string): void {
    this.userMenuClick.emit(action);
    this.closeMobileMenu();
  }

  onMobileLogout(): void {
    this.logoutClick.emit();
    this.closeMobileMenu();
  }

  isNavigationActive(item: NavigationItem): boolean {
    return this.router.url === item.route;
  }

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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.classList.remove('mobile-menu-open');
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;

    document.body.classList.remove('mobile-menu-open');
    const scrollY = document.body.style.top;
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  private closeAllMenus(): void {
    this.closeUserMenu();
    this.closeNotifications();
    this.closeMobileMenu();
  }

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

  get mobileOverlayClasses(): string {
    const classes = ['navigation-header__mobile-overlay'];

    if (this.isMobileMenuOpen) {
      classes.push('navigation-header__mobile-overlay--open');
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

  setUserMenuRef(element: HTMLElement): void {
    this.userMenuElement = element;
  }

  setNotificationsRef(element: HTMLElement): void {
    this.notificationsElement = element;
  }

  getAvatarUrl(email: string): string {
    if (!email) {
      return 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=40';
    }

    const name = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=40`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src =
        'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=40';
    }
  }

  getNavigationIcon(icon?: string): IconDefinition {
    switch (icon) {
      case 'dashboard':
        return this.faTachometerAlt;
      case 'transactions':
        return this.faExchangeAlt;
      case 'credit':
      case 'credit-card':
        return this.faCreditCard;
      default:
        return this.faTachometerAlt;
    }
  }
}
