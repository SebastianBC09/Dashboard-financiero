import { LoadingSpinnerConfig } from './loading-spinner.component';

export const LOADING_SPINNER_PRESETS: Record<string, LoadingSpinnerConfig> = {
  quickOperation: {
    size: 'small',
    state: 'primary',
    message: 'Verificando datos...',
    showSubtitle: false,
    showProgress: false,
  },
  transaction: {
    size: 'medium',
    state: 'fintech',
    message: 'Procesando su transacción',
    subtitle: 'Esto puede tomar unos segundos',
    showProgress: true,
    showSubtitle: true,
  },
  initialLoad: {
    size: 'large',
    state: 'primary',
    message: 'Cargando su dashboard financiero',
    subtitle: 'Preparando sus datos más recientes',
    showProgress: false,
    showSubtitle: true,
  },
  success: {
    size: 'medium',
    state: 'success',
    message: 'Pago procesado exitosamente',
    showSubtitle: false,
    showProgress: false,
  },
  warning: {
    size: 'medium',
    state: 'warning',
    message: 'Verificando límites de crédito',
    subtitle: 'Validación adicional requerida',
    showProgress: false,
    showSubtitle: true,
  },
  error: {
    size: 'medium',
    state: 'error',
    message: 'Reintentando conexión',
    subtitle: 'Verificando conectividad',
    showProgress: false,
    showSubtitle: true,
  },
  fullScreen: {
    size: 'large',
    state: 'primary',
    mode: 'overlay',
    message: 'Cargando aplicación',
    subtitle: 'Inicializando servicios',
    showProgress: true,
    showSubtitle: true,
  },
  dataLoading: {
    size: 'medium',
    state: 'primary',
    message: 'Cargando datos',
    subtitle: 'Sincronizando información',
    showProgress: true,
    showSubtitle: true,
  },
};

export const getSpinnerConfig = (preset: string): LoadingSpinnerConfig => {
  return (
    LOADING_SPINNER_PRESETS[preset] || LOADING_SPINNER_PRESETS['quickOperation']
  );
};
