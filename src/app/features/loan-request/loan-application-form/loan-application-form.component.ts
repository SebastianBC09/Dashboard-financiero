import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from '../../../core/loan-application.service';

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [
    CommonModule,
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
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loanApplicationService: LoanApplicationService,
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

      // Obtener valores del formulario (ya están parseados como números)
      const request = this.creditForm.value;

      // Simular el crédito
      this.loanApplicationService
        .simulateLoan(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (simulation) => {
            this.simulation = simulation;
            this.showSimulation = true;
            this.isSimulating = false;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Error al simular el crédito';
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

      // Obtener valores del formulario (ya están parseados como números)
      const request = this.creditForm.value;

      this.loanApplicationService
        .submitApplication(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (application) => {
            this.isSubmitting = false;
            this.showSimulation = false;
            this.showSuccess = true;
            this.successMessage = `¡Solicitud enviada exitosamente! Tu número de solicitud es: ${application.id}. Nuestro equipo revisará tu información y te contactaremos en los próximos 3-5 días hábiles con una respuesta.`;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Error al enviar la solicitud';
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
        return 'Este campo es requerido';
      }
      if (field.errors?.['min']) {
        if (fieldName === 'amount') {
          return 'El monto mínimo es $500,000';
        }
        if (fieldName === 'monthlyIncome') {
          return 'Los ingresos mínimos son $100,000';
        }
      }
      if (field.errors?.['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    return '';
  }

  // Formatear número con separadores de miles (puntos)
  formatNumber(value: string): string {
    // Remover todos los caracteres no numéricos excepto la coma decimal
    const cleanValue = value.replace(/[^\d,]/g, '');

    // Si no hay valor, retornar vacío
    if (!cleanValue) return '';

    // Separar parte entera y decimal
    const parts = cleanValue.split(',');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1] || '';

    // Formatear parte entera con puntos
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Reconstruir con decimal si existe
    return decimalPart
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  }

  // Convertir valor formateado a número
  parseFormattedNumber(value: string): number {
    if (!value) return 0;

    // Remover puntos y convertir coma a punto para JavaScript
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  }

  // Manejar input de monto
  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatNumber(input.value);
    input.value = formattedValue;

    // Actualizar el valor en el formulario
    const numericValue = this.parseFormattedNumber(formattedValue);
    this.creditForm.patchValue({ amount: numericValue }, { emitEvent: false });
  }

  // Manejar input de ingresos mensuales
  onIncomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatNumber(input.value);
    input.value = formattedValue;

    // Actualizar el valor en el formulario
    const numericValue = this.parseFormattedNumber(formattedValue);
    this.creditForm.patchValue(
      { monthlyIncome: numericValue },
      { emitEvent: false },
    );
  }

  // Obtener valor formateado para display
  getFormattedValue(fieldName: string): string {
    const field = this.creditForm.get(fieldName);
    const value = field?.value;
    if (!value) return '';
    return this.formatNumber(value.toString());
  }
}
