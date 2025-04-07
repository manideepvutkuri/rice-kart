import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-account',
  imports: [],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  user: any = {};
  email = '';

  constructor(private authService: AuthService,private router: Router,) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(userData => {
      if (userData) {
        this.user = {
          name: userData.name,
          phone: userData.mobile,
          email: userData.email,
          address: userData.address
        };
      }
    });
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
    // this.isSidebarOpen = false;
  }
  // onChangePassword() {
  //   this.authService.getCurrentUser().subscribe(user => {
  //     if (user?.email) {
  //       this.authService.sendPasswordResetEmail(user.email).then(() => {
  //         this.toast.show('Password reset link sent to your email.', { classname: 'bg-success text-white', delay: 3000 });
  //       }).catch(err => {
  //         this.toast.show('Error sending password reset email.', { classname: 'bg-danger text-white', delay: 3000 });
  //         console.error(err);
  //       });
  //     }
  //   });
   onForgotPassword() {
    // if (!this.email) {
    //   alert('Please enter your email first.');
    //   return;
    // }
console.log("ccc")
    
      const message =  this.authService.resetPassword(this.email);
      alert(message); // Show success message
   
  }
}
