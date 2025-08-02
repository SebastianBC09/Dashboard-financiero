// Type guards para el Mock HTTP Service
// Single Responsibility: Solo maneja validación de tipos

import {
  LoginCredentials,
  LoanApplicationData,
  TransactionData,
} from '../types/mock-http.types';

/**
 * Type guard para validar credenciales de login
 * @param obj - Objeto a validar
 * @returns true si el objeto es LoginCredentials válido
 */
export function isLoginCredentials(obj: unknown): obj is LoginCredentials {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'email' in obj &&
    'password' in obj &&
    typeof (obj as LoginCredentials).email === 'string' &&
    typeof (obj as LoginCredentials).password === 'string'
  );
}

/**
 * Type guard para validar datos de solicitud de préstamo
 * @param obj - Objeto a validar
 * @returns true si el objeto es LoanApplicationData válido
 */
export function isLoanApplicationData(
  obj: unknown,
): obj is LoanApplicationData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'userId' in obj &&
    'loanAmount' in obj &&
    'purpose' in obj &&
    'termInMonths' in obj &&
    'monthlyPayment' in obj &&
    'interestRate' in obj &&
    'status' in obj &&
    'documents' in obj &&
    typeof (obj as LoanApplicationData).userId === 'string' &&
    typeof (obj as LoanApplicationData).loanAmount === 'number' &&
    typeof (obj as LoanApplicationData).purpose === 'string' &&
    typeof (obj as LoanApplicationData).termInMonths === 'number' &&
    typeof (obj as LoanApplicationData).monthlyPayment === 'number' &&
    typeof (obj as LoanApplicationData).interestRate === 'number' &&
    Array.isArray((obj as LoanApplicationData).documents)
  );
}

/**
 * Type guard para validar datos de transacción
 * @param obj - Objeto a validar
 * @returns true si el objeto es TransactionData válido
 */
export function isTransactionData(obj: unknown): obj is TransactionData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'userId' in obj &&
    'type' in obj &&
    'amount' in obj &&
    'description' in obj &&
    'category' in obj &&
    'status' in obj &&
    'transactionDate' in obj &&
    typeof (obj as TransactionData).userId === 'string' &&
    typeof (obj as TransactionData).amount === 'number' &&
    typeof (obj as TransactionData).description === 'string' &&
    typeof (obj as TransactionData).category === 'string' &&
    (obj as TransactionData).transactionDate instanceof Date
  );
}
