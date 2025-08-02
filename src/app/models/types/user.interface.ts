export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type CreditScoreRange = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  employmentInfo: {
    employer: string;
    position: string;
    monthlyIncome: number;
    employmentStartDate: Date;
  };
  creditScore: number;
  accountBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserType =
  | { type: 'CUSTOMER'; isActive: true }
  | { type: 'ADMIN'; isActive: true }
  | { type: 'SUSPENDED'; isActive: false };
