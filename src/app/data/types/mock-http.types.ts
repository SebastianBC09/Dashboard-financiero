// Single Responsibility: Solo maneja tipos relacionados con HTTP mock

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
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  documents: string[];
}

export interface TransactionData {
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'FEE';
  amount: number;
  description: string;
  category: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  transactionDate: Date;
}
