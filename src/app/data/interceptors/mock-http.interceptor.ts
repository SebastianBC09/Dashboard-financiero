import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockHttpService } from '../services/mock-http.service';
import { inject } from '@angular/core';

export const mockHttpInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (request.url.includes('/api/')) {
    const mockHttpService = inject(MockHttpService);
    return handleMockRequest(request, mockHttpService);
  }
  return next(request);
};

function handleMockRequest(
  request: HttpRequest<unknown>,
  mockHttpService: MockHttpService,
): Observable<HttpEvent<unknown>> {
  const url = request.url;
  const method = request.method.toUpperCase();

  try {
    switch (method) {
      case 'GET':
        return mockHttpService
          .get(url, {
            params: request.params,
            headers: request.headers,
          })
          .pipe(
            map(
              (response) =>
                new HttpResponse({
                  body: response,
                  status: response.status,
                  statusText: response.message,
                }),
            ),
          );

      case 'POST':
        return mockHttpService
          .post(url, request.body, {
            headers: request.headers,
          })
          .pipe(
            map(
              (response) =>
                new HttpResponse({
                  body: response,
                  status: response.status,
                  statusText: response.message,
                }),
            ),
          );

      default:
        throw new Error(`Método HTTP no soportado: ${method}`);
    }
  } catch (error) {
    throw error;
  }
}
