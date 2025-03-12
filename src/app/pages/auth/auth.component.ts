import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email = '';
  password = '';
  isLoginMode = true; // Toggle between login & signup

  constructor(private authService: AuthService,private router: Router) {}

  async onSubmit() {
    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password);
        alert('Login Successful!');
        this.router.navigate(['/']);
      } else {
        await this.authService.signUp(this.email, this.password);
        alert('Signup Successful!');
        this.isLoginMode = true;
        this.router.navigate(['/']);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Authentication Failed: ' + error.message);
      } else {
        alert('An unknown error occurred');
        console.error(error);
      }
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
