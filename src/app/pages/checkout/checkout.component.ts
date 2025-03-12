// import { Component } from '@angular/core';
// // import { CartService } from 'src/app/services/cart.service';
// import { Router } from '@angular/router';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent {
//   constructor(public cartService: CartService, private router: Router) {}

//   placeOrder() {
//     alert("Order placed successfully!");
//     this.cartService.clearCart();
//     this.router.navigate(['/home']);
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  async placeOrder() {
    const cartItems = this.cartService.getCartItemsSnapshot(); // ✅ Get current cart items
  
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // Debugging step: Log cart items
    console.log("Cart Items:", cartItems);
  
    // Ensure totalAmount calculation is correct
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.price || 0; // Ensure price exists
      const quantity = item.quantity || 1; // Default to 1 if quantity is missing
      return sum + price * quantity;
    }, 0);
  
    // Debugging step: Check total amount before saving
    console.log("Calculated Total Amount:", totalAmount);
  
    const order = {
      items: [...cartItems], 
      totalAmount: totalAmount, // ✅ Use corrected totalAmount
      timestamp: new Date(),
      status: 'Pending',
    };
  
    try {
      await this.orderService.placeOrder(order);
      alert("Order placed successfully!");
      this.cartService.clearCart();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  }
  
}
