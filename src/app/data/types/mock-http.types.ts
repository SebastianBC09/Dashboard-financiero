import {
  TransactionType,
  TransactionStatus,
  LoanStatus,
} from '../../models/types/financial.interface';

export interface MockHttpResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoanApplicationData {
  userId: string;
  loanAmount: number;
  purpose: string;
  termInMonths: number;
  monthlyPayment: number;
  interestRate: number;
  status: LoanStatus;
  documents: string[];
}

export interface TransactionData {
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  status: TransactionStatus;
  transactionDate: Date;
}
