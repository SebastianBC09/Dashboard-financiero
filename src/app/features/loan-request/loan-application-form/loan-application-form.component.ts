import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalculator,
  faCheckCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  ButtonComponent,
  MessageComponent,
  LoadingSpinnerComponent,
} from '../../../shared';
import {
  LoanApplicationService,
  LoanSimulation,
  SanitizationService,
} from '../../../core';

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ButtonComponent,
    MessageComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './loan-application-form.component.html',
  styleUrl: './loan-application-form.component.scss',
})
export class LoanApplicationFormComponent implements OnInit, OnDestroy {
  creditForm!: FormGroup;
  isLoading = false;
  isSimulating = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  simulation?: LoanSimulation;
  showSimulation = false;
  showSuccess = false;

  faCalculator = faCalculator;
  faCheckCircle = faCheckCircle;
  faArrowLeft = faArrowLeft;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loanApplicationService: LoanApplicationService,
    private sanitizationService: SanitizationService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.creditForm = this.formBuilder.group({
      creditType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(500000)]],
      term: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(100000)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    if (this.creditForm.valid) {
      this.isSimulating = true;
      this.errorMessage = '';
      this.showSimulation = false;

      const formValue = this.creditForm.value;
      const sanitizedRequest = {
        creditType: this.sanitizationService.validateCreditType(
          formValue.creditType,
        ),
        amount: this.sanitizationService.validateInput(
          formValue.amount,
          'number',
        ),
        term: this.sanitizationService.validateInput(formValue.term, 'number'),
        monthlyIncome: this.sanitizationService.validateInput(
          formValue.monthlyIncome,
          'number',
        ),
        terms: Boolean(formValue.terms),
      };

      this.loanApplicationService
        .simulateLoan(sanitizedRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (simulation) => {
            this.simulation = simulation;
            this.showSimulation = true;
            this.isSimulating = false;
          },
          error: (error) => {
            this.errorMessage = this.sanitizationService.sanitizeText(
              error.message || 'Error al simular el crédito',
            );
            this.isSimulating = false;
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  submitApplication(): void {
    if (this.creditForm.valid && this.simulation) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.creditForm.value;
      const sanitizedRequest = {
        creditType: this.sanitizationService.validateCreditType(
          formValue.creditType,
        ),
        amount: this.sanitizationService.validateInput(
          formValue.amount,
          'number',
        ),
        term: this.sanitizationService.validateInput(formValue.term, 'number'),
        monthlyIncome: this.sanitizationService.validateInput(
          formValue.monthlyIncome,
          'number',
        ),
        terms: Boolean(formValue.terms),
      };

      this.loanApplicationService
        .submitApplication(sanitizedRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (application) => {
            this.isSubmitting = false;
            this.showSimulation = false;
            this.showSuccess = true;
            const applicationId = this.sanitizationService.sanitizeText(
              String(application.id),
            );
            this.successMessage = this.sanitizationService.sanitizeText(
              `¡Solicitud enviada exitosamente! Tu número de solicitud es: ${applicationId}. Nuestro equipo revisará tu información y te contactaremos en los próximos 3-5 días hábiles con una respuesta.`,
            );
          },
          error: (error) => {
            this.errorMessage = this.sanitizationService.sanitizeText(
              error.message || 'Error al enviar la solicitud',
            );
            this.isSubmitting = false;
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.creditForm.controls).forEach((key) => {
      const control = this.creditForm.get(key);
      control?.markAsTouched();
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }

  clearSuccess(): void {
    this.successMessage = '';
    this.showSuccess = false;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getFieldError(fieldName: string): string {
    const field = this.creditForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return this.sanitizationService.sanitizeText('Este campo es requerido');
      }
      if (field.errors?.['min']) {
        if (fieldName === 'amount') {
          return this.sanitizationService.sanitizeText(
            'El monto mínimo es $500,000',
          );
        }
        if (fieldName === 'monthlyIncome') {
          return this.sanitizationService.sanitizeText(
            'Los ingresos mínimos son $100,000',
          );
        }
      }
      if (field.errors?.['requiredTrue']) {
        return this.sanitizationService.sanitizeText(
          'Debes aceptar los términos y condiciones',
        );
      }
    }
    return '';
  }

  formatNumber(value: string): string {
    const cleanValue = value.replace(/[^\d,]/g, '');

    if (!cleanValue) return '';

    const parts = cleanValue.split(',');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1] || '';

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  }

  parseFormattedNumber(value: string): number {
    if (!value) return 0;
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatNumber(input.value);
    input.value = formattedValue;

    const numericValue = this.parseFormattedNumber(formattedValue);
    this.creditForm.patchValue({ amount: numericValue }, { emitEvent: false });
  }
  onIncomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatNumber(input.value);
    input.value = formattedValue;

    const numericValue = this.parseFormattedNumber(formattedValue);
    this.creditForm.patchValue(
      { monthlyIncome: numericValue },
      { emitEvent: false },
    );
  }

  getFormattedValue(fieldName: string): string {
    const field = this.creditForm.get(fieldName);
    const value = field?.value;
    if (!value) return '';
    return this.formatNumber(value.toString());
  }
}
