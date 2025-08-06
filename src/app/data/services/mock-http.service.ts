import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  MOCK_USERS,
  MOCK_TRANSACTIONS,
  MOCK_ACCOUNT_BALANCES,
  MOCK_LOAN_APPLICATIONS,
} from '../mock/mock-data';
import { MockHttpResponse } from '../types/mock-http.types';
import {
  isLoginCredentials,
  isLoanApplicationData,
  isTransactionData,
} from '../guards/mock-http.guards';
import {
  getEndpointFromUrl,
  generateMockToken,
  getRandomDelay,
} from '../utils/mock-http.utils';

@Injectable({
  providedIn: 'root',
})
export class MockHttpService {
  private mockData = {
    users: [...MOCK_USERS],
    transactions: [...MOCK_TRANSACTIONS],
    accountBalances: [...MOCK_ACCOUNT_BALANCES],
    loanApplications: [...MOCK_LOAN_APPLICATIONS],
  };

  constructor(private http: HttpClient) {}

  public get<T>(
    url: string,
    options?: { params?: HttpParams; headers?: HttpHeaders },
  ): Observable<MockHttpResponse<T>> {
    const endpoint = getEndpointFromUrl(url);
    const params = options?.params;

    let data: T;

    const urlParts = url.split('/');
    const hasSpecificId =
      urlParts.length > 3 && urlParts[urlParts.length - 1] !== endpoint;

    switch (endpoint) {
      case 'users':
        if (hasSpecificId) {
          const userId = urlParts[urlParts.length - 1];
          data = this.mockData.users.find((user) => user.id === userId) as T;
        } else if (params?.has('id')) {
          const userId = params.get('id');
          data = this.mockData.users.find((user) => user.id === userId) as T;
        } else if (params?.has('email')) {
          const email = params.get('email');
          data = this.mockData.users.find((user) => user.email === email) as T;
        } else {
          data = this.mockData.users as T;
        }
        break;

      case 'transactions':
        if (hasSpecificId) {
          const transactionId = urlParts[urlParts.length - 1];
          data = this.mockData.transactions.find(
            (t) => t.id === transactionId,
          ) as T;
        } else if (params?.has('userId')) {
          const userId = params.get('userId');
          const limit = params.get('limit')
            ? parseInt(params.get('limit')!)
            : 10;
          data = this.mockData.transactions
            .filter((t) => t.userId === userId)
            .sort(
              (a, b) =>
                b.transactionDate.getTime() - a.transactionDate.getTime(),
            )
            .slice(0, limit) as T;
        } else {
          data = this.mockData.transactions as T;
        }
        break;

      case 'account-balances':
        if (params?.has('userId')) {
          const userId = params.get('userId');
          data = this.mockData.accountBalances.find(
            (balance) => balance.userId === userId,
          ) as T;
        } else {
          data = this.mockData.accountBalances as T;
        }
        break;

      case 'loan-applications':
        if (params?.has('userId')) {
          const userId = params.get('userId');
          data = this.mockData.loanApplications
            .filter((la) => la.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as T;
        } else {
          data = this.mockData.loanApplications as T;
        }
        break;

      default:
        return throwError(
          () => new Error(`Endpoint no encontrado: ${endpoint}`),
        );
    }

    if (!data) {
      return throwError(() => new Error('Recurso no encontrado'));
    }

    return of({
      data,
      status: 200,
      message: 'Operación exitosa',
    }).pipe(delay(getRandomDelay()));
  }

  public post<T>(
    url: string,
    body: unknown,
    options?: { headers?: HttpHeaders },
  ): Observable<MockHttpResponse<T>> {
    const endpoint = getEndpointFromUrl(url);

    let newData: T;

    switch (endpoint) {
      case 'auth/login':
        if (!isLoginCredentials(body)) {
          return throwError(() => new Error('Datos de login inválidos'));
        }

        const { email, password } = body;
        const user = this.mockData.users.find((u) => u.email === email);

        if (!user) {
          return throwError(() => new Error('Usuario no encontrado'));
        }

        if (password !== 'password123') {
          return throwError(() => new Error('Contraseña incorrecta'));
        }

        newData = {
          user,
          token: generateMockToken(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        } as T;
        break;

      case 'loan-applications':
        if (!isLoanApplicationData(body)) {
          return throwError(
            () => new Error('Datos de solicitud de préstamo inválidos'),
          );
        }

        const newApplication = {
          ...body,
          id: (this.mockData.loanApplications.length + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.mockData.loanApplications.push(newApplication);
        newData = newApplication as T;
        break;

      case 'transactions':
        if (!isTransactionData(body)) {
          return throwError(() => new Error('Datos de transacción inválidos'));
        }

        const newTransaction = {
          ...body,
          id: (this.mockData.transactions.length + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.mockData.transactions.push(newTransaction);
        newData = newTransaction as T;
        break;

      default:
        return throwError(
          () => new Error(`Endpoint no encontrado: ${endpoint}`),
        );
    }

    return of({
      data: newData,
      status: 201,
      message: 'Recurso creado exitosamente',
    }).pipe(delay(getRandomDelay()));
  }

  public resetMockData(): void {
    this.mockData = {
      users: [...MOCK_USERS],
      transactions: [...MOCK_TRANSACTIONS],
      accountBalances: [...MOCK_ACCOUNT_BALANCES],
      loanApplications: [...MOCK_LOAN_APPLICATIONS],
    };
  }

  public getMockData(): unknown {
    return this.mockData;
  }
}
