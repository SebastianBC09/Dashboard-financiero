import {
  LoanApplicationService,
  LoanApplicationRequest,
  LoanSimulation,
} from './loan-application.service';

describe('LoanApplicationService', () => {
  let service: LoanApplicationService;

  const validRequest: LoanApplicationRequest = {
    creditType: 'personal',
    amount: 1000000,
    term: 24,
    monthlyIncome: 2000000,
    terms: true,
  };

  beforeEach(() => {
    service = new LoanApplicationService();
  });

  describe('submitApplication', () => {
    it('should submit application successfully', (done: DoneFn) => {
      service.submitApplication(validRequest).subscribe({
        next: (application) => {
          expect(application.id).toBeTruthy();
          expect(application.creditType).toBe(validRequest.creditType);
          expect(application.amount).toBe(validRequest.amount);
          expect(application.term).toBe(validRequest.term);
          expect(application.monthlyIncome).toBe(validRequest.monthlyIncome);
          expect(application.terms).toBe(validRequest.terms);
          expect(application.status).toBe('pending');
          expect(application.createdAt).toBeInstanceOf(Date);
          expect(application.estimatedMonthlyPayment).toBeGreaterThan(0);
          expect(application.interestRate).toBeGreaterThan(0);
          done();
        },
        error: done.fail,
      });
    });

    it('should reject application without terms acceptance', (done: DoneFn) => {
      const requestWithoutTerms: LoanApplicationRequest = {
        ...validRequest,
        terms: false,
      };

      service.submitApplication(requestWithoutTerms).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(
            'Debes aceptar los términos y condiciones',
          );
          done();
        },
      });
    });

    it('should reject application with amount below minimum', (done: DoneFn) => {
      const lowAmountRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 300000,
      };

      service.submitApplication(lowAmountRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('El monto mínimo es $500,000');
          done();
        },
      });
    });

    it('should reject application with income below minimum', (done: DoneFn) => {
      const lowIncomeRequest: LoanApplicationRequest = {
        ...validRequest,
        monthlyIncome: 50000,
      };

      service.submitApplication(lowIncomeRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('Los ingresos mínimos son $100,000');
          done();
        },
      });
    });

    it('should store application in internal array', (done: DoneFn) => {
      service.submitApplication(validRequest).subscribe({
        next: (application) => {
          service.getUserApplications().subscribe({
            next: (applications) => {
              expect(applications.length).toBeGreaterThan(0);
              const storedApp = applications.find(
                (app) => app.id === application.id,
              );
              expect(storedApp).toBeTruthy();
              expect(storedApp).toEqual(application);
              done();
            },
            error: done.fail,
          });
        },
        error: done.fail,
      });
    });
  });

  describe('simulateLoan', () => {
    it('should simulate personal loan correctly', (done: DoneFn) => {
      const personalRequest: LoanApplicationRequest = {
        ...validRequest,
        creditType: 'personal',
      };

      service.simulateLoan(personalRequest).subscribe({
        next: (simulation) => {
          expect(simulation.estimatedMonthlyPayment).toBeGreaterThan(0);
          expect(simulation.interestRate).toBe(0.025);
          expect(simulation.totalAmount).toBeGreaterThan(
            personalRequest.amount,
          );
          expect(simulation.approvalProbability).toBeDefined();
          expect(simulation.recommendations).toBeInstanceOf(Array);
          expect(simulation.recommendations.length).toBeGreaterThan(0);
          done();
        },
        error: done.fail,
      });
    });

    it('should simulate vehicle loan correctly', (done: DoneFn) => {
      const vehicleRequest: LoanApplicationRequest = {
        ...validRequest,
        creditType: 'vehicle',
      };

      service.simulateLoan(vehicleRequest).subscribe({
        next: (simulation) => {
          expect(simulation.estimatedMonthlyPayment).toBeGreaterThan(0);
          expect(simulation.interestRate).toBe(0.018);
          expect(simulation.totalAmount).toBeGreaterThan(vehicleRequest.amount);
          expect(simulation.approvalProbability).toBeDefined();
          done();
        },
        error: done.fail,
      });
    });

    it('should simulate housing loan correctly', (done: DoneFn) => {
      const housingRequest: LoanApplicationRequest = {
        ...validRequest,
        creditType: 'housing',
      };

      service.simulateLoan(housingRequest).subscribe({
        next: (simulation) => {
          expect(simulation.estimatedMonthlyPayment).toBeGreaterThan(0);
          expect(simulation.interestRate).toBe(0.012);
          expect(simulation.totalAmount).toBeGreaterThan(housingRequest.amount);
          expect(simulation.approvalProbability).toBeDefined();
          done();
        },
        error: done.fail,
      });
    });

    it('should calculate high approval probability for good debt-to-income ratio', (done: DoneFn) => {
      const goodIncomeRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 1000000,
        monthlyIncome: 5000000,
      };

      service.simulateLoan(goodIncomeRequest).subscribe({
        next: (simulation) => {
          expect(simulation.approvalProbability).toBe('high');
          done();
        },
        error: done.fail,
      });
    });

    it('should calculate medium approval probability for moderate debt-to-income ratio', (done: DoneFn) => {
      const moderateIncomeRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 2000000,
        monthlyIncome: 3000000,
      };

      service.simulateLoan(moderateIncomeRequest).subscribe({
        next: (simulation) => {
          expect(simulation.approvalProbability).toBe('medium');
          done();
        },
        error: done.fail,
      });
    });

    it('should calculate low approval probability for high debt-to-income ratio', (done: DoneFn) => {
      const lowIncomeRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 3000000,
        monthlyIncome: 1500000,
      };

      service.simulateLoan(lowIncomeRequest).subscribe({
        next: (simulation) => {
          expect(simulation.approvalProbability).toBe('low');
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('getUserApplications', () => {
    it('should return empty array initially', (done: DoneFn) => {
      service.getUserApplications().subscribe({
        next: (applications) => {
          expect(applications).toEqual([]);
          done();
        },
        error: done.fail,
      });
    });

    it('should return submitted applications', (done: DoneFn) => {
      service.submitApplication(validRequest).subscribe({
        next: () => {
          service.getUserApplications().subscribe({
            next: (applications) => {
              expect(applications.length).toBe(1);
              expect(applications[0].creditType).toBe(validRequest.creditType);
              expect(applications[0].amount).toBe(validRequest.amount);
              done();
            },
            error: done.fail,
          });
        },
        error: done.fail,
      });
    });

    it('should return multiple applications', (done: DoneFn) => {
      const secondRequest: LoanApplicationRequest = {
        ...validRequest,
        creditType: 'vehicle',
        amount: 2000000,
      };

      service.submitApplication(validRequest).subscribe({
        next: () => {
          service.submitApplication(secondRequest).subscribe({
            next: () => {
              service.getUserApplications().subscribe({
                next: (applications) => {
                  expect(applications.length).toBe(2);
                  expect(
                    applications.some((app) => app.creditType === 'personal'),
                  ).toBe(true);
                  expect(
                    applications.some((app) => app.creditType === 'vehicle'),
                  ).toBe(true);
                  done();
                },
                error: done.fail,
              });
            },
            error: done.fail,
          });
        },
        error: done.fail,
      });
    });
  });

  describe('getApplicationById', () => {
    it('should return null for non-existent application', (done: DoneFn) => {
      service.getApplicationById('non-existent-id').subscribe({
        next: (application) => {
          expect(application).toBeNull();
          done();
        },
        error: done.fail,
      });
    });

    it('should return application by id', (done: DoneFn) => {
      service.submitApplication(validRequest).subscribe({
        next: (submittedApplication) => {
          service.getApplicationById(submittedApplication.id).subscribe({
            next: (application) => {
              expect(application).toEqual(submittedApplication);
              done();
            },
            error: done.fail,
          });
        },
        error: done.fail,
      });
    });
  });

  describe('private methods', () => {
    it('should calculate monthly payment correctly', () => {
      const request: LoanApplicationRequest = {
        creditType: 'personal',
        amount: 1000000,
        term: 12,
        monthlyIncome: 2000000,
        terms: true,
      };

      const monthlyPayment = (service as any).calculateMonthlyPayment(request);

      expect(monthlyPayment).toBeGreaterThan(request.amount / request.term);
      expect(monthlyPayment).toBeLessThan(request.amount * 0.2);
    });

    it('should return correct interest rates for different credit types', () => {
      expect((service as any).getInterestRate('personal')).toBe(0.025);
      expect((service as any).getInterestRate('vehicle')).toBe(0.018);
      expect((service as any).getInterestRate('housing')).toBe(0.012);
    });

    it('should generate unique ids', () => {
      const id1 = (service as any).generateId();
      const id2 = (service as any).generateId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    it('should generate recommendations based on debt-to-income ratio', () => {
      const highRatioRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 5000000,
        monthlyIncome: 1000000,
      };

      const recommendations = (service as any).generateRecommendations(
        highRatioRequest,
        80,
      );

      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(
        recommendations.some((rec: string) => rec.includes('reducir')),
      ).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle zero amount gracefully', (done: DoneFn) => {
      const zeroAmountRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: 0,
      };

      service.submitApplication(zeroAmountRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('El monto mínimo es $500,000');
          done();
        },
      });
    });

    it('should handle negative amount gracefully', (done: DoneFn) => {
      const negativeAmountRequest: LoanApplicationRequest = {
        ...validRequest,
        amount: -100000,
      };

      service.submitApplication(negativeAmountRequest).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe('El monto mínimo es $500,000');
          done();
        },
      });
    });

    it('should handle very long terms', (done: DoneFn) => {
      const longTermRequest: LoanApplicationRequest = {
        ...validRequest,
        term: 120,
      };

      service.simulateLoan(longTermRequest).subscribe({
        next: (simulation) => {
          expect(simulation.estimatedMonthlyPayment).toBeGreaterThan(0);
          expect(simulation.totalAmount).toBeGreaterThan(
            longTermRequest.amount,
          );
          done();
        },
        error: done.fail,
      });
    });
  });
});
