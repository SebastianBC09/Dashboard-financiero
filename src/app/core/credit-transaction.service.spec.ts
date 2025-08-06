import {
  CreditTransactionService,
  CreditTransactionError,
  CreditTransactionFilters,
} from './credit-transaction.service';
import { Transaction } from '../models/types';

describe('CreditTransactionService', () => {
  let service: CreditTransactionService;
  let httpClientSpy: jasmine.SpyObj<any>;

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: '1',
      type: 'PAYMENT',
      amount: 800000,
      description: 'Pago cuota crédito de vivienda',
      category: 'MORTGAGE',
      status: 'COMPLETED',
      transactionDate: new Date('2024-12-01'),
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      userId: '1',
      type: 'DISBURSEMENT',
      amount: 89000,
      description: 'Compra tarjeta de crédito',
      category: 'CREDIT_CARD_PURCHASE',
      status: 'COMPLETED',
      transactionDate: new Date('2024-11-28'),
      createdAt: new Date('2024-11-28'),
      updatedAt: new Date('2024-11-28'),
    },
    {
      id: '3',
      userId: '2',
      type: 'PAYMENT',
      amount: 350000,
      description: 'Pago cuota préstamo vehicular',
      category: 'AUTO_LOAN',
      status: 'COMPLETED',
      transactionDate: new Date('2024-11-25'),
      createdAt: new Date('2024-11-25'),
      updatedAt: new Date('2024-11-25'),
    },
  ];

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new CreditTransactionService(httpClientSpy);
  });

  describe('getCreditTransactions', () => {
    it('should get all transactions without filters', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(mockTransactions);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactions().subscribe({
        next: (transactions) => {
          expect(transactions).toEqual(mockTransactions);
          done();
        },
        error: done.fail,
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        '/api/transactions',
        jasmine.any(Object),
      );
    });

    it('should filter transactions by userId', (done: DoneFn) => {
      const filters: CreditTransactionFilters = { userId: '1' };
      const filteredTransactions = mockTransactions.filter(
        (t) => t.userId === '1',
      );

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(filteredTransactions);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactions(filters).subscribe({
        next: (transactions) => {
          expect(transactions.length).toBe(2);
          expect(transactions.every((t) => t.userId === '1')).toBe(true);
          done();
        },
        error: done.fail,
      });
    });

    it('should filter transactions by type', (done: DoneFn) => {
      const filters: CreditTransactionFilters = { type: 'PAYMENT' };
      const filteredTransactions = mockTransactions.filter(
        (t) => t.type === 'PAYMENT',
      );

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(filteredTransactions);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactions(filters).subscribe({
        next: (transactions) => {
          expect(transactions.length).toBe(2);
          expect(transactions.every((t) => t.type === 'PAYMENT')).toBe(true);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle HTTP error', (done: DoneFn) => {
      const errorResponse = { message: 'Server error' };

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (successCallback: any, errorCallback: any) => {
            errorCallback(errorResponse);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactions().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeInstanceOf(CreditTransactionError);
          expect(error.code).toBe('GET_TRANSACTIONS_ERROR');
          expect(error.message).toContain('Error al obtener transacciones');
          done();
        },
      });
    });
  });

  describe('getCreditTransactionById', () => {
    it('should get transaction by id successfully', (done: DoneFn) => {
      const transactionId = '1';
      const expectedTransaction = mockTransactions[0];

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(expectedTransaction);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactionById(transactionId).subscribe({
        next: (transaction) => {
          expect(transaction).toEqual(expectedTransaction);
          done();
        },
        error: done.fail,
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `/api/transactions/${transactionId}`,
      );
    });

    it('should handle transaction not found', (done: DoneFn) => {
      const transactionId = '999';
      const errorResponse = { message: 'Transaction not found' };

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (successCallback: any, errorCallback: any) => {
            errorCallback(errorResponse);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactionById(transactionId).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeInstanceOf(CreditTransactionError);
          expect(error.code).toBe('TRANSACTION_NOT_FOUND');
          done();
        },
      });
    });
  });

  describe('getCreditTransactionStats', () => {
    it('should calculate transaction statistics correctly', (done: DoneFn) => {
      const userId = '1';
      const userTransactions = mockTransactions.filter(
        (t) => t.userId === userId,
      );

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback(userTransactions);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactionStats(userId).subscribe({
        next: (stats) => {
          expect(stats.totalTransactions).toBe(2);
          expect(stats.totalAmount).toBe(889000);
          expect(stats.averageAmount).toBe(444500);
          expect(stats.mostCommonCategory).toBe('MORTGAGE');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle empty transaction list', (done: DoneFn) => {
      const userId = '999';

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (callback: any) => {
            callback([]);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactionStats(userId).subscribe({
        next: (stats) => {
          expect(stats.totalTransactions).toBe(0);
          expect(stats.totalAmount).toBe(0);
          expect(stats.averageAmount).toBe(0);
          expect(stats.mostCommonCategory).toBe('');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle HTTP error in stats calculation', (done: DoneFn) => {
      const userId = '1';
      const errorResponse = { message: 'Server error' };

      httpClientSpy.get.and.returnValue(
        jasmine.createSpyObj('Observable', ['pipe']).pipe.and.returnValue({
          subscribe: (successCallback: any, errorCallback: any) => {
            errorCallback(errorResponse);
            return { unsubscribe: () => {} };
          },
        }),
      );

      service.getCreditTransactionStats(userId).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error).toBeInstanceOf(CreditTransactionError);
          expect(error.code).toBe('GET_TRANSACTIONS_ERROR');
          done();
        },
      });
    });
  });

  describe('private methods', () => {
    it('should build HTTP params correctly', () => {
      const filters: CreditTransactionFilters = {
        userId: '1',
        type: 'PAYMENT',
        category: 'MORTGAGE',
        status: 'COMPLETED',
        limit: 10,
      };

      const params = (service as any).buildHttpParams(filters);

      expect(params.get('userId')).toBe('1');
      expect(params.get('type')).toBe('PAYMENT');
      expect(params.get('category')).toBe('MORTGAGE');
      expect(params.get('status')).toBe('COMPLETED');
      expect(params.get('limit')).toBe('10');
    });

    it('should filter transactions by date range correctly', () => {
      const startDate = new Date('2024-11-01');
      const endDate = new Date('2024-11-30');
      const filters: CreditTransactionFilters = { startDate, endDate };

      const filteredTransactions = (service as any).filterCreditTransactions(
        mockTransactions,
        filters,
      );

      expect(filteredTransactions.length).toBe(2);
      expect(
        filteredTransactions.every(
          (t: Transaction) =>
            t.transactionDate >= startDate && t.transactionDate <= endDate,
        ),
      ).toBe(true);
    });

    it('should handle error with proper error code', (done: DoneFn) => {
      const error = new Error('Test error');
      const code = 'TEST_ERROR';

      (service as any).handleError(error, code).subscribe({
        next: () => fail('Should have failed'),
        error: (thrownError: CreditTransactionError) => {
          expect(thrownError).toBeInstanceOf(CreditTransactionError);
          expect(thrownError.code).toBe(code);
          expect(thrownError.message).toContain(
            'Error al obtener transacciones',
          );
          done();
        },
      });
    });
  });
});
