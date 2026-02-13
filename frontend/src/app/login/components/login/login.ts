import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['cliente', Validators.required] // Default role
  });

  isLoginMode = true;
  errorMessage: string | null = null;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
          next: (res) => {
            console.log('Login successful', res);
            // Redirect based on role
            if (res.user.role_id === 2) {
              this.router.navigate(['/provider']);
            } else if (res.user.role_id === 3) {
              this.router.navigate(['/customer']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Login failed', err);
            this.errorMessage = err.error?.message || 'Login failed';
          }
        });
      }
    } else {
      if (this.registerForm.valid) {
        this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            console.log('Registration successful');
            this.isLoginMode = true; // Switch to login
            this.errorMessage = 'Registration successful! Please login.';
          },
          error: (err) => {
            console.error('Registration failed', err);
            this.errorMessage = err.error?.message || 'Registration failed';
          }
        });
      }
    }
  }
}
