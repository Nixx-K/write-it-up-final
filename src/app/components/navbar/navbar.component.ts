import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface User {
  username: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUser$!: Observable<User | null>; // properly typed
  isDarkMode = false;

  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$ as Observable<User | null>;

    const savedTheme: 'light' | 'dark' | null =
      localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.isDarkMode ? this.enableLightMode() : this.enableDarkMode();
  }

  enableDarkMode() {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    this.isDarkMode = true;
    localStorage.setItem('theme', 'dark');
  }

  enableLightMode() {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    this.isDarkMode = false;
    localStorage.setItem('theme', 'light');
  }
}
