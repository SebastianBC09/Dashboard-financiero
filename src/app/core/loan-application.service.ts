import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

export interface LoanApplication {
  id: string;
  creditType: 'personal' | 'vehicle' | 'housing';
  amount: number;
  term: number;
  monthlyIncome: number;
  terms: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  estimatedMonthlyPayment?: number;
  interestRate?: number;
}

export interface LoanApplicationRequest {
  creditType: 'personal' | 'vehicle' | 'housing';
  amount: number;
  term: number;
  monthlyIncome: number;
  terms: boolean;
}

export interface LoanSimulation {
  estimatedMonthlyPayment: number;
  interestRate: number;
  totalAmount: number;
  approvalProbability: 'high' | 'medium' | 'low';
  recommendations: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  private applications: LoanApplication[] = [];

  constructor() {}

  submitApplication(
    request: LoanApplicationRequest,
  ): Observable<LoanApplication> {
    if (!request.terms) {
      return throwError(
        () => new Error('Debes aceptar los términos y condiciones'),
      );
    }
    if (request.amount < 500000) {
      return throwError(() => new Error('El monto mínimo es $500,000'));
    }
    if (request.monthlyIncome < 100000) {
      return throwError(() => new Error('Los ingresos mínimos son $100,000'));
    }

    return of(this.createApplication(request)).pipe(delay(2000));
  }

  simulateLoan(request: LoanApplicationRequest): Observable<LoanSimulation> {
    const simulation: LoanSimulation = this.calculateSimulation(request);

    return of(simulation).pipe(delay(1500));
  }

  getUserApplications(): Observable<LoanApplication[]> {
    return of([...this.applications]).pipe(delay(500));
  }

  getApplicationById(id: string): Observable<LoanApplication | null> {
    const application = this.applications.find((app) => app.id === id);
    return of(application || null).pipe(delay(300));
  }

  private createApplication(request: LoanApplicationRequest): LoanApplication {
    const application: LoanApplication = {
      id: this.generateId(),
      ...request,
      status: 'pending',
      createdAt: new Date(),
      estimatedMonthlyPayment: this.calculateMonthlyPayment(request),
      interestRate: this.getInterestRate(request.creditType),
    };

    this.applications.push(application);
    return application;
  }

  private calculateSimulation(request: LoanApplicationRequest): LoanSimulation {
    const interestRate = this.getInterestRate(request.creditType);
    const monthlyPayment = this.calculateMonthlyPayment(request);
    const totalAmount = monthlyPayment * request.term;

    const debtToIncomeRatio = (monthlyPayment / request.monthlyIncome) * 100;
    let approvalProbability: 'high' | 'medium' | 'low';

    if (debtToIncomeRatio <= 30) {
      approvalProbability = 'high';
    } else if (debtToIncomeRatio <= 50) {
      approvalProbability = 'medium';
    } else {
      approvalProbability = 'low';
    }

    const recommendations = this.generateRecommendations(
      request,
      debtToIncomeRatio,
    );

    return {
      estimatedMonthlyPayment: monthlyPayment,
      interestRate,
      totalAmount,
      approvalProbability,
      recommendations,
    };
  }

  private getInterestRate(creditType: string): number {
    const rates = {
      personal: 0.025,
      vehicle: 0.018,
      housing: 0.012,
    };
    return rates[creditType as keyof typeof rates] || 0.025;
  }

  private calculateMonthlyPayment(request: LoanApplicationRequest): number {
    const monthlyRate = this.getInterestRate(request.creditType);
    const numerator =
      request.amount * monthlyRate * Math.pow(1 + monthlyRate, request.term);
    const denominator = Math.pow(1 + monthlyRate, request.term) - 1;
    return Math.round(numerator / denominator);
  }

  private generateRecommendations(
    request: LoanApplicationRequest,
    debtToIncomeRatio: number,
  ): string[] {
    const recommendations: string[] = [];

    if (debtToIncomeRatio > 40) {
      recommendations.push(
        'Considera reducir el monto solicitado para mejorar tu capacidad de pago',
      );
    }

    if (request.term > 60) {
      recommendations.push(
        'Plazos largos pueden resultar en mayor costo total del crédito',
      );
    }

    if (request.creditType === 'personal' && request.amount > 50000000) {
      recommendations.push(
        'Para montos altos, considera un crédito hipotecario o vehicular',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Tu solicitud cumple con los criterios básicos de evaluación',
      );
    }

    return recommendations;
  }

  private generateId(): string {
    return 'LOAN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
