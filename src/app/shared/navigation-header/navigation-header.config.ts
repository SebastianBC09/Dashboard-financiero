import {
  NavigationItem,
  UserProfile,
  NotificationItem,
} from './navigation-header.component';

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard',
  },
  {
    id: 'transactions',
    label: 'Transacciones',
    route: '/transactions',
    icon: 'transactions',
  },
  {
    id: 'credit',
    label: 'Solicitar Crédito',
    route: '/credit-request',
    icon: 'credit',
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Pago procesado',
    message: 'Su pago de $1,250 ha sido procesado exitosamente',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: '2',
    title: 'Límite de crédito actualizado',
    message: 'Su límite de crédito ha sido aumentado a $50,000',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
  },
  {
    id: '3',
    title: 'Documento requerido',
    message: 'Por favor complete su documentación para continuar',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
  },
];

export const NOTIFICATION_PRESETS: Record<string, NotificationItem[]> = {
  financial: DEFAULT_NOTIFICATIONS,

  system: [
    {
      id: '1',
      title: 'Mantenimiento programado',
      message: 'El sistema estará en mantenimiento mañana de 2:00 a 4:00 AM',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: false,
    },
    {
      id: '2',
      title: 'Error del sistema',
      message: 'Se ha detectado un error en el módulo de pagos',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
  ],

  empty: [],
};
