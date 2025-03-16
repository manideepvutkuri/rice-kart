import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports:[CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService,private router: Router,private location: Location,private orderService: OrderService,private authService: AuthService) {}

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
  async placeOrder() {
    const cartItems = this.cartService.getCartItemsSnapshot(); // Get current cart items

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    console.log("Cart Items:", cartItems); // Debugging

    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    console.log("Calculated Total Amount:", totalAmount); // Debugging

    const user = this.authService.getCurrentUser();
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const order = {
      items: [...cartItems],
      totalAmount: totalAmount,
      timestamp: new Date(),
      status: "Pending",
    };

    try {
      await this.orderService.placeOrder(order);
      alert("Order placed successfully!");
      this.cartService.clearCart();
      this.router.navigate(['/order-history']);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  }
}
