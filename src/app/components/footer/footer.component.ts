import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
  @Component({ 
     selector: 'app-footer',
     imports:[CommonModule],
     templateUrl: './footer.component.html',
      styleUrls: ['./footer.component.css']
     })
  export class FooterComponent { 
    cartCount: number = 0;
    constructor(private cartService: CartService,private router: Router) {}
    ngOnInit(){
      this.cartService.getCartItems().subscribe(items => {
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      });
    }
    navigateTo(path: string) {
      this.router.navigate([path]);
      // this.isSidebarOpen = false;
    }
    isLoginPage(): boolean {
      return this.router.url.includes('/auth');
    }
    
  }