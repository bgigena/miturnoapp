import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    SelectModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  roles = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Proveedor', value: 'proveedor' }
  ];

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['cliente', Validators.required]
  });

  isLoginMode = true;
  errorMessage: string | null = null;
  isLoading = false;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
    this.loginForm.reset();
    this.registerForm.reset({ role: 'cliente' });
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;
    
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.user.role_id === 2) {
              this.router.navigate(['/provider']);
            } else if (res.user.role_id === 3) {
              this.router.navigate(['/customer']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Login failed';
          }
        });
      } else {
         this.isLoading = false;
      }
    } else {
      if (this.registerForm.valid) {
        this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.isLoginMode = true;
            this.errorMessage = 'Registration successful! Please login.';
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Registration failed';
          }
        });
      } else {
         this.isLoading = false;
      }
    }
  }
}
