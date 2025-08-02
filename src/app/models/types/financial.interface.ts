export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'TRANSFER'
  | 'PAYMENT'
  | 'FEE';
export type TransactionStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';
export type LoanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  status: TransactionStatus;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountBalance {
  userId: string;
  currentBalance: number;
  availableBalance: number;
  pendingTransactions: number;
  lastUpdated: Date;
}

export interface FinancialSummary {
  userId: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlyAverage: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface LoanApplication {
  id: string;
  userId: string;
  loanAmount: number;
  purpose: string;
  termInMonths: number;
  monthlyPayment: number;
  interestRate: number;
  status: LoanStatus;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface LoanEligibility {
  userId: string;
  isEligible: boolean;
  maxLoanAmount: number;
  recommendedTerm: number;
  estimatedInterestRate: number;
  monthlyPaymentEstimate: number;
  factors: {
    creditScore: number;
    incomeStability: number;
    debtToIncomeRatio: number;
    employmentHistory: number;
  };
}
