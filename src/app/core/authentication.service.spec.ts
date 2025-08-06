import { AuthenticationService } from './authentication.service';
import { UserCredentials, UserSession } from '../models/types/auth.interface';
import { User } from '../models/types';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpClientSpy: jasmine.SpyObj<any>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://example.com/avatar.jpg',
    dateOfBirth: new Date('1990-01-01'),
    phoneNumber: '+573001234567',
    address: {
      street: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110111',
      country: 'Colombia',
    },
    employmentInfo: {
      employer: 'Empresa Test',
      position: 'Desarrollador',
      monthlyIncome: 3000000,
      employmentStartDate: new Date('2020-01-01'),
    },
    creditScore: 750,
    accountBalance: 5000000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCredentials: UserCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockSession: UserSession = {
    user: mockUser,
    token: 'mock-token-123',
    expiresAt: new Date(Date.now() + 3600000),
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new AuthenticationService(httpClientSpy);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully', (done: DoneFn) => {
      httpClientSpy.post.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(mockSession);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.authenticateUser(mockCredentials).subscribe({
        next: (session) => {
          expect(session).toEqual(mockSession);
          expect(service.isUserAuthenticated()).toBe(true);
          expect(service.getCurrentUser()).toEqual(mockUser);
          done();
        },
        error: done.fail,
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        '/api/auth/login',
        mockCredentials,
      );
    });

    it('should reject authentication with short password', (done: DoneFn) => {
      const shortPasswordCredentials: UserCredentials = {
        email: 'test@example.com',
        password: '123',
      };

      service.authenticateUser(shortPasswordCredentials).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(
            'La contraseña debe tener al menos 6 caracteres',
          );
          expect(service.isUserAuthenticated()).toBe(false);
          done();
        },
      });
    });

    it('should handle authentication error from server', (done: DoneFn) => {
      const errorResponse = { message: 'Credenciales inválidas' };

      httpClientSpy.post.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (successCallback: any, errorCallback: any) => {
            errorCallback(errorResponse);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.authenticateUser(mockCredentials).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Error de autenticación');
          expect(service.isUserAuthenticated()).toBe(false);
          done();
        },
      });
    });
  });

  describe('logoutUser', () => {
    it('should logout user successfully', (done: DoneFn) => {
      // Simular sesión activa
      (service as any).currentSessionSubject.next(mockSession);
      localStorage.setItem('userSession', JSON.stringify(mockSession));

      expect(service.isUserAuthenticated()).toBe(true);

      service.logoutUser().subscribe({
        next: () => {
          expect(service.isUserAuthenticated()).toBe(false);
          expect(service.getCurrentUser()).toBeNull();
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('refreshUserSession', () => {
    it('should refresh session successfully', (done: DoneFn) => {
      // Simular sesión activa
      (service as any).currentSessionSubject.next(mockSession);
      localStorage.setItem('userSession', JSON.stringify(mockSession));

      const originalToken = service.getCurrentUser()?.id || '';

      service.refreshUserSession().subscribe({
        next: (refreshedSession) => {
          expect(refreshedSession).toBeTruthy();
          expect(refreshedSession!.user.id).toBe(mockUser.id);
          expect(refreshedSession!.token).not.toBe(originalToken);
          expect(refreshedSession!.expiresAt.getTime()).toBeGreaterThan(
            Date.now(),
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should return null when no session exists', (done: DoneFn) => {
      service.refreshUserSession().subscribe({
        next: (session) => {
          expect(session).toBeNull();
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('session management', () => {
    it('should detect session expiring soon', (done: DoneFn) => {
      const expiringSession: UserSession = {
        user: mockUser,
        token: 'expiring-token',
        expiresAt: new Date(Date.now() + 180000),
      };

      // Simular sesión activa
      (service as any).currentSessionSubject.next(expiringSession);

      expect(service.isSessionExpiringSoon(5)).toBe(true);
      expect(service.getSessionTimeRemaining()).toBeLessThan(300000);
      done();
    });

    it('should extend session successfully', (done: DoneFn) => {
      // Simular sesión activa
      (service as any).currentSessionSubject.next(mockSession);
      const originalExpiry = service.getSessionTimeRemaining();

      service.extendSession().subscribe({
        next: (extendedSession) => {
          expect(extendedSession).toBeTruthy();
          expect(extendedSession.expiresAt.getTime()).toBeGreaterThan(
            Date.now() + 300000,
          );
          expect(service.getSessionTimeRemaining()).toBeGreaterThan(
            originalExpiry,
          );
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('error handling', () => {
    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('userSession', 'invalid-json');

      const newService = new AuthenticationService(httpClientSpy);

      expect(newService.isUserAuthenticated()).toBe(false);
    });

    it('should handle malformed session data in localStorage', () => {
      const malformedSession = { user: { id: '1' } };
      localStorage.setItem('userSession', JSON.stringify(malformedSession));

      const newService = new AuthenticationService(httpClientSpy);

      expect(newService.isUserAuthenticated()).toBe(false);
    });
  });
});
