import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

declare var Razorpay: any;
declare var bootstrap: any;

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
  // async placeOrder() {
  //   const cartItems = this.cartService.getCartItemsSnapshot(); // Get current cart items

  //   if (!cartItems || cartItems.length === 0) {
  //     alert("Your cart is empty!");
  //     return;
  //   }

  //   console.log("Cart Items:", cartItems); // Debugging

  //   const totalAmount = cartItems.reduce((sum, item) => {
  //     const price = item.price || 0;
  //     const quantity = item.quantity || 1;
  //     return sum + price * quantity;
  //   }, 0);

  //   console.log("Calculated Total Amount:", totalAmount); // Debugging

  //   const user = this.authService.getCurrentUser();
  //   if (!user) {
  //     alert("Please log in to place an order.");
  //     return;
  //   }

  //   const order = {
  //     items: [...cartItems],
  //     totalAmount: totalAmount,
  //     timestamp: new Date(),
  //     status: "Pending",
  //   };

  //   try {
  //     await this.orderService.placeOrder(order);
  //     alert("Order placed successfully!");
  //     this.cartService.clearCart();
  //     this.router.navigate(['/order-history']);
  //   } catch (error) {
  //     console.error("Order placement failed:", error);
  //     alert("Failed to place order. Please try again.");
  //   }
  // }
  async placeOrder() {
    const cartItems = this.cartService.getCartItemsSnapshot();
  
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
  
    const user = await firstValueFrom(this.authService.getCurrentUser());// Await user retrieval
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
  
    // ✅ Razorpay Payment Integration
    const options = {
      key: "rzp_test_TQV67Ri1UfCvd9",
      amount: totalAmount * 100, // Razorpay expects amount in paisa
      currency: "INR",
      name: "Rice Store",
      description: "Order Payment",
      image: "/assets/images/rrr.jpg",
      handler: async (response: any) => {
        console.log("Payment Successful:", response);
        await this.storeOrder(response.razorpay_payment_id, cartItems, totalAmount, user);
        this.openSuccessModal(); // ✅ Show Success Popup
      },
      prefill: {
        email: user.email,
        contact: user.mobile || "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        escape: false, // Prevent closing on outside click
        ondismiss: () => {
          console.log("Payment closed by user");
          this.openFailureModal(); // ✅ Show Failure Popup if dismissed
        }
      }
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  }
  
  // ✅ Store Order Only After Successful Payment
  async storeOrder(paymentId: string, cartItems: any[], totalAmount: number, user: any) {
    const order = {
      items: [...cartItems],
      totalAmount: totalAmount,
      userId: user.uid,
      userEmail: user.email,
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
      paymentId: paymentId,
      orderStatus: "Placed",
      createdAt: new Date(),
    };
  
    try {
      await this.orderService.placeOrder(order);
      this.cartService.clearCart();
    } catch (error) {
      console.error("Error storing order:", error);
    }
  }
  
  // ✅ Open Payment Success Modal
  openSuccessModal() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // ✅ Show modal
    } else {
      console.error("Success modal element not found.");
    }
  }
  
  // ✅ Open Payment Failure Modal
  openFailureModal() {
    const failureModal = new bootstrap.Modal(document.getElementById('paymentFailureModal'));
    failureModal.show();
  }
  
  // ✅ Close Success Modal and Redirect
  closeSuccessModal() {
    this.router.navigate(['/order-history']);
  }
  
  // ✅ Close Failure Modal and Retry Payment
  closeFailureModal() {
    window.location.reload();
  }
  
}
