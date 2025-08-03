import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Transaction,
  AccountBalance,
  FinancialSummary,
  LoanApplication,
  LoanEligibility,
  TransactionType,
  TransactionStatus,
  LoanStatus,
} from '../models/types';
import {
  MOCK_TRANSACTIONS,
  MOCK_ACCOUNT_BALANCES,
  MOCK_LOAN_APPLICATIONS,
} from '../data/mock/mock-data';

@Injectable({
  providedIn: 'root',
})
export class FinancialDataService {
  // Mock transaction data
  private readonly mockTransactions: Transaction[] = MOCK_TRANSACTIONS;

  // Mock account balances
  private readonly mockAccountBalances: AccountBalance[] =
    MOCK_ACCOUNT_BALANCES;

  // Mock loan applications
  private readonly mockLoanApplications: LoanApplication[] =
    MOCK_LOAN_APPLICATIONS;

  constructor() {}

  public getUserTransactions(
    userId: string,
    limit: number = 10,
  ): Observable<Transaction[]> {
    const userTransactions = this.mockTransactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime())
      .slice(0, limit);

    return of(userTransactions).pipe(delay(800));
  }

  public getAccountBalance(userId: string): Observable<AccountBalance> {
    const balance = this.mockAccountBalances.find((b) => b.userId === userId);

    if (!balance) {
      throw new Error('Balance de cuenta no encontrado');
    }

    return of(balance).pipe(delay(500));
  }

  public getFinancialSummary(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Observable<FinancialSummary> {
    const userTransactions = this.mockTransactions.filter(
      (t) =>
        t.userId === userId &&
        t.transactionDate >= startDate &&
        t.transactionDate <= endDate,
    );

    const totalIncome = userTransactions
      .filter((t) => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = userTransactions
      .filter((t) => ['WITHDRAWAL', 'PAYMENT', 'FEE'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const daysInPeriod = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const monthlyAverage = (netSavings / daysInPeriod) * 30;

    const summary: FinancialSummary = {
      userId,
      totalIncome,
      totalExpenses,
      netSavings,
      monthlyAverage,
      period: { startDate, endDate },
    };

    return of(summary).pipe(delay(600));
  }

  public getUserLoanApplications(
    userId: string,
  ): Observable<LoanApplication[]> {
    const applications = this.mockLoanApplications
      .filter((la) => la.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return of(applications).pipe(delay(700));
  }

  public createLoanApplication(
    application: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<LoanApplication> {
    const newApplication: LoanApplication = {
      ...application,
      id: (this.mockLoanApplications.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockLoanApplications.push(newApplication);

    return of(newApplication).pipe(delay(1000));
  }

  public checkLoanEligibility(
    userId: string,
    requestedAmount: number,
  ): Observable<LoanEligibility> {
    // Mock eligibility calculation based on user data
    const user = this.getMockUser(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const creditScore = user.creditScore;
    const monthlyIncome = user.employmentInfo.monthlyIncome;
    const currentBalance = user.accountBalance;

    // Simple eligibility calculation
    const isEligible = creditScore >= 700 && monthlyIncome >= 5000;
    const maxLoanAmount = Math.min(monthlyIncome * 3, 50000);
    const recommendedTerm = requestedAmount <= 10000 ? 24 : 36;
    const estimatedInterestRate = creditScore >= 750 ? 6.5 : 8.5;
    const monthlyPaymentEstimate = this.calculateMonthlyPayment(
      requestedAmount,
      estimatedInterestRate,
      recommendedTerm,
    );

    const eligibility: LoanEligibility = {
      userId,
      isEligible,
      maxLoanAmount,
      recommendedTerm,
      estimatedInterestRate,
      monthlyPaymentEstimate,
      factors: {
        creditScore,
        incomeStability: monthlyIncome >= 5000 ? 85 : 60,
        debtToIncomeRatio: (monthlyPaymentEstimate / monthlyIncome) * 100,
        employmentHistory: this.calculateEmploymentHistory(
          user.employmentInfo.employmentStartDate,
        ),
      },
    };

    return of(eligibility).pipe(delay(800));
  }

  private getMockUser(
    userId: string,
  ):
    | {
        creditScore: number;
        employmentInfo: { monthlyIncome: number; employmentStartDate: Date };
        accountBalance: number;
      }
    | undefined {
    // This would normally come from a user service
    const mockUsers = [
      {
        id: '1',
        creditScore: 750,
        employmentInfo: {
          monthlyIncome: 8500,
          employmentStartDate: new Date('2020-03-01'),
        },
        accountBalance: 25000,
      },
      {
        id: '2',
        creditScore: 780,
        employmentInfo: {
          monthlyIncome: 7200,
          employmentStartDate: new Date('2019-07-15'),
        },
        accountBalance: 18000,
      },
    ];

    return mockUsers.find((u) => u.id === userId);
  }

  private calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    termMonths: number,
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / termMonths;

    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    );
  }

  private calculateEmploymentHistory(startDate: Date): number {
    const months =
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return Math.min(months, 60); // Cap at 60 months for scoring
  }
}
