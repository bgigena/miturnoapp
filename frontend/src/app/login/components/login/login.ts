import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
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
    MessageModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private socialAuthService = inject(SocialAuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authSubscription!: Subscription;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoginMode = true;
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit() {
    // If user is already logged in, redirect them
    if (this.authService.isAuthenticated()) {
      console.log('Usuario ya autenticado, redirigiendo...');
      this.redirectUserBasedOnRole(this.authService.getUserRole());
    }

    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        console.log('Login con Google detectado, procesando...');
        this.isLoading = true;
        this.errorMessage = null;
        this.cdr.detectChanges();
        
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: (res) => {
            console.log('Login con Google exitoso, redirigiendo...');
            this.isLoading = false;
            this.redirectUserBasedOnRole(this.authService.getUserRole());
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error en login con Google:', err);
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Google Login failed';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private redirectUserBasedOnRole(role: string | null) {
    console.log('Redirigiendo basado en rol:', role);
    if (role === 'proveedor') {
      this.router.navigate(['/provider/dashboard']).then(success => console.log('Navegación a /provider/dashboard:', success));
    } else if (role === 'cliente') {
      this.router.navigate(['/customer/dashboard']).then(success => console.log('Navegación a /customer/dashboard:', success));
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']).then(success => console.log('Navegación a /admin/dashboard:', success));
    } else {
      console.log('Rol no reconocido o nulo, navegando a /');
      this.router.navigate(['/']).then(success => console.log('Navegación a /:', success));
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onSubmit() {
    console.log('Formulario enviado, modo login:', this.isLoginMode);
    this.errorMessage = null;
    this.isLoading = true;
    
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        console.log('Ejecutando login con:', this.loginForm.value.email);
        this.authService.login(this.loginForm.value).subscribe({
          next: (res) => {
            console.log('Login exitoso, respuesta del servidor:', res);
            this.isLoading = false;
            this.redirectUserBasedOnRole(this.authService.getUserRole());
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error en login:', err);
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Login failed';
            this.cdr.detectChanges();
          }
        });
      } else {
         console.warn('Formulario de login inválido');
         this.isLoading = false;
      }
    } else {
      if (this.registerForm.valid) {
        this.authService.register(this.registerForm.value).subscribe({
          next: () => {
            console.log('Registro exitoso');
            this.isLoading = false;
            this.isLoginMode = true;
            this.errorMessage = 'Registration successful! Please login.';
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error en registro:', err);
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Registration failed';
            this.cdr.detectChanges();
          }
        });
      } else {
         console.warn('Formulario de registro inválido');
         this.isLoading = false;
      }
    }
  }
}
