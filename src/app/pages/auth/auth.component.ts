// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-auth',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './auth.component.html',
//   styleUrls: ['./auth.component.css']
// })
// export class AuthComponent {
//   email = '';
//   password = '';
//   isLoginMode = true; // Toggle between login & signup

//   constructor(private authService: AuthService,private router: Router) {}

//   async onSubmit() {
//     try {
//       if (this.isLoginMode) {
//         await this.authService.login(this.email, this.password);
//         alert('Login Successful!');
//         this.router.navigate(['/']);
//       } else {
//         await this.authService.signUp(this.email, this.password);
//         alert('Signup Successful!');
//         this.isLoginMode = true;
//         this.router.navigate(['/']);
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         alert('Authentication Failed: ' + error.message);
//       } else {
//         alert('An unknown error occurred');
//         console.error(error);
//       }
//     }
//   }

//   toggleMode() {
//     this.isLoginMode = !this.isLoginMode;
//   }
// }

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
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  address = '';
  isLoginMode = true; // Toggle between login & signup
  emailNotVerified = false;
  mobile = '';
confirmMobile = '';
  isLoading: boolean | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  async onForgotPassword() {
    if (!this.email) {
      alert('Please enter your email first.');
      return;
    }

    try {
      const message = await this.authService.resetPassword(this.email);
      alert(message); // Show success message
    } catch (error) {
      alert('Error sending reset link. Try again.');
    }
  }

  async onSubmit() {
    this.isLoading = true; // Show loader
    try {
      if (this.isLoginMode) {
        // Login
        await this.authService.login(this.email, this.password);
        // alert('Login Successful!');
        this.router.navigate(['/']);
      } else {
        // Signup validation
        if (!this.name || !this.address || !this.confirmPassword || !this.mobile || !this.confirmMobile) {
          alert('All fields are required for Signup!');
          return;
        }
        if (this.mobile !== this.confirmMobile) {
          alert('Mobile numbers do not match!');
          return;
        }
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }

        // Signup
        await this.authService.signUp(this.name, this.email, this.password, this.address, this.mobile);
        // alert('Signup Successful! Please log in.');
        alert('Signup Successful! A verification email has been sent.');
        this.emailNotVerified = true;
        this.toggleMode(); // Switch to login mode
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Authentication Failed: ' + error.message);
      } else {
        alert('An unknown error occurred');
        console.error(error);
      }
    }finally {
      this.isLoading = false; // Hide loader
    }
  }

  async resendEmailVerification() {
    await this.authService.resendVerificationEmail();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.emailNotVerified = false; // Reset email verification state
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.address = '';
  }
  login() {
    this.isLoading = true; // Show loader
  
    this.authService.login(this.email, this.password).then(() => {
      this.isLoading = false; // Hide loader before navigating
      this.router.navigate(['/home']);
    }).catch(error => {
      this.isLoading = false; // Hide loader on error
      console.error('Login failed:', error);
    });
  }
  
}
