import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoginMode = true;
  errorMessage = '';

  loginData = { email: '', password: '' };
  registerData = { username: '', email: '', password: '', confirmPassword: '' };

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    if (this.loginData.email && this.loginData.password) {
      this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Błędny email lub hasło.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Błąd logowania.';
        }
      });
    }
  }

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Hasła nie są identyczne.';
      return;
    }
    
    if (this.registerData.username && this.registerData.email && this.registerData.password) {
      this.authService.register({
        username: this.registerData.username,
        email: this.registerData.email,
        password: this.registerData.password
      }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = 'Błąd podczas tworzenia konta.';
        }
      });
    }
  }

  quickLogin(email: string) {
    this.loginData.email = email;
    this.loginData.password = '123';
    this.onLogin();
  }
}