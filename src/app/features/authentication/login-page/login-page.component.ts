import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthenticationService } from '../../../core/authentication.service';
import { UserCredentials } from '../../../models/types/auth.interface';
import { ButtonComponent } from '../../../shared/button/button.component';
import { MessageComponent } from '../../../shared/message/message.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ButtonComponent,
    MessageComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faEnvelope = faEnvelope;
  faLock = faLock;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: UserCredentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authenticationService
      .authenticateUser(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.errorMessage = '';
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.message ||
            'Error al iniciar sesión. Por favor, intenta de nuevo.';
          this.loginForm.get('password')?.reset();
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get emailField() {
    return this.loginForm.get('email');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

  get isEmailInvalid(): boolean {
    return (this.emailField?.invalid && this.emailField?.touched) || false;
  }

  get isPasswordInvalid(): boolean {
    return (
      (this.passwordField?.invalid && this.passwordField?.touched) || false
    );
  }

  get emailErrorMessage(): string {
    if (this.emailField?.errors?.['required']) {
      return 'El correo electrónico es requerido';
    }
    if (this.emailField?.errors?.['email']) {
      return 'Ingresa un correo electrónico válido';
    }
    return '';
  }

  get passwordErrorMessage(): string {
    if (this.passwordField?.errors?.['required']) {
      return 'La contraseña es requerida';
    }
    if (this.passwordField?.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}
