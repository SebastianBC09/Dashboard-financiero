import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { SessionMonitorService } from './core/session-monitor.service';
import { mockHttpInterceptor } from './data/interceptors/mock-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true,
    }),
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withInterceptors([mockHttpInterceptor])),
    SessionMonitorService,
  ],
};
