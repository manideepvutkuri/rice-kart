import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports:[CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService,private router: Router,private location: Location) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }
  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }
  
  clearCart() {
    this.cartService.clearCart();
    this.cartItems = []; // Clear UI
  }
  checkout() {
    if (this.cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    this.router.navigate(['/checkout']);
  }
  goBack() {
    this.location.back();
  }
}
