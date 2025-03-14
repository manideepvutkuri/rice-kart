import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports:[CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  isAdmin$!: Observable<boolean>;
  constructor(private cartService: CartService,public authService: AuthService,private router: Router) {}

  ngOnInit() {

    this.authService.user$.subscribe(user => {
      console.log('Current User in Header:', user);
    });

    this.cartService.getCartItems().subscribe(items => {
      this.cartCount = items.length; // Live cart count update
    });

    // this.isAdmin$ = this.authService.user$.pipe(
    //   map(user => user?.['role'] === 'admin') // Access 'role' safely
    // );
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => {
        console.log('Is Admin:', user?.['role'] === 'admin'); // ✅ Debugging admin check
        return user?.['role'] === 'admin';
      })
    );
  }
  logout() {
    this.authService.logout();
  }
  navigateToLogin() {
    this.router.navigate(['/auth']);
  }
  isLoginPage(): boolean {
    return this.router.url.includes('/auth');
  }
  navigateToOrderHistory() {
    this.router.navigate(['/order-history']);
  }
  navigateToHome(){
    this.router.navigate(['/home']);
  }
  gotoadmin(){
    this.router.navigate(['/admin']);
  }
  adminProd(){
    this.router.navigate(['/admin-rice']);
  }
}
