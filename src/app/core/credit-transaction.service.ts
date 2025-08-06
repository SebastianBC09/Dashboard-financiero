import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/types';
import { MockHttpResponse } from '../data/types/mock-http.types';

export class CreditTransactionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'CreditTransactionError';
  }
}

export interface CreditTransactionFilters {
  userId?: string;
  type?: string;
  category?: string;
  status?: string;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CreditTransactionService {
  private readonly baseUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  getCreditTransactions(
    filters: CreditTransactionFilters = {},
  ): Observable<Transaction[]> {
    try {
      const params = this.buildHttpParams(filters);

      return this.http
        .get<MockHttpResponse<Transaction[]>>(this.baseUrl, { params })
        .pipe(
          map((response) =>
            this.filterCreditTransactions(response.data, filters),
          ),
          catchError((error) =>
            this.handleError(error, 'GET_TRANSACTIONS_ERROR'),
          ),
        );
    } catch (error) {
      return throwError(
        () =>
          new CreditTransactionError(
            'Error al construir parámetros de petición',
            'PARAMETERS_ERROR',
          ),
      );
    }
  }

  private buildHttpParams(filters: CreditTransactionFilters): HttpParams {
    let params = new HttpParams();

    if (filters.userId) {
      params = params.set('userId', filters.userId);
    }

    if (filters.type) {
      params = params.set('type', filters.type);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return params;
  }

  private filterCreditTransactions(
    transactions: Transaction[],
    filters: CreditTransactionFilters,
  ): Transaction[] {
    let filteredTransactions = transactions;

    if (filters.startDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.transactionDate >= filters.startDate!,
      );
    }

    if (filters.endDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.transactionDate <= filters.endDate!,
      );
    }

    return filteredTransactions.filter(
      (t) =>
        t.type === 'PAYMENT' ||
        t.type === 'DISBURSEMENT' ||
        t.category === 'CREDIT_CARD' ||
        t.category === 'MORTGAGE' ||
        t.category === 'PERSONAL_LOAN',
    );
  }

  private handleError(error: unknown, code: string): Observable<never> {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return throwError(() => new CreditTransactionError(errorMessage, code));
  }

  getCreditTransactionById(transactionId: string): Observable<Transaction> {
    if (!transactionId || transactionId.trim() === '') {
      return throwError(
        () =>
          new CreditTransactionError(
            'ID de transacción es requerido',
            'INVALID_ID',
          ),
      );
    }

    return this.http
      .get<MockHttpResponse<Transaction>>(`${this.baseUrl}/${transactionId}`)
      .pipe(
        map((response) => response.data),
        catchError((error) =>
          this.handleError(error, 'GET_TRANSACTION_BY_ID_ERROR'),
        ),
      );
  }

  getCreditTransactionStats(userId: string): Observable<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    mostCommonCategory: string;
  }> {
    if (!userId || userId.trim() === '') {
      return throwError(
        () =>
          new CreditTransactionError(
            'ID de usuario es requerido',
            'INVALID_USER_ID',
          ),
      );
    }

    return this.getCreditTransactions({ userId }).pipe(
      map((transactions) => this.calculateTransactionStats(transactions)),
      catchError((error) => this.handleError(error, 'GET_STATS_ERROR')),
    );
  }

  private calculateTransactionStats(transactions: Transaction[]): {
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    mostCommonCategory: string;
  } {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageAmount =
      totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const categoryCount = transactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommonCategory =
      Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'Sin categoría';

    return {
      totalTransactions,
      totalAmount,
      averageAmount,
      mostCommonCategory,
    };
  }
}
