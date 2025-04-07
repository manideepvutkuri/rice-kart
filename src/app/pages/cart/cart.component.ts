import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;
declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports:[CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  // Store Address Fields
  userAddress = {
    flatNo: '',
    landmark: '',
    area: '',
    mobile: ''
  };
  showErrorMsg = false;

  constructor(private cartService: CartService,private router: Router,private location: Location,private orderService: OrderService,private authService: AuthService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = this.groupCartItems(items);
      this.totalPrice = this.getTotalPrice();
    });
  }

  // ✅ Merge duplicate items by grouping them
  groupCartItems(items: any[]): any[] {
    const groupedItems: { [key: string]: any } = {};

    items.forEach(item => {
      if (groupedItems[item.id]) {
        groupedItems[item.id].quantity += 1;
      } else {
        groupedItems[item.id] = { ...item, quantity: 1 };
      }
    });

    return Object.values(groupedItems);
  }

  // ✅ Calculate total price correctly based on quantity
  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  // ✅ Remove one quantity of an item
  // removeItem(itemId: any) {
  //   const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
  //   if (itemIndex !== -1) {
  //     if (this.cartItems[itemIndex].quantity > 1) {
  //       this.cartItems[itemIndex].quantity--;
  //     } else {
  //       this.cartItems.splice(itemIndex, 1); // Remove item if quantity is 1
  //     }
  //   }
  //   this.totalPrice = this.getTotalPrice();
  // }
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }
  
  // removeItem(itemId: any) {
  //   console.log("Removing item with ID:", itemId);
  //   const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
  //   if (itemIndex !== -1) {
  //     console.log("Item found at index:", itemIndex);
  //     if (this.cartItems[itemIndex].quantity > 1) {
  //       this.cartItems[itemIndex].quantity--;
  //     } else {
  //       console.log("Item not found!");
  //       this.cartItems.splice(itemIndex, 1); // Remove item if quantity is 1
  //     }
      
  //     // ✅ Update the cart in Firestore or Local Storage
  //     // this.cartService.updateCart(this.cartItems);
  //   }
  
  //   // ✅ Refresh the total price after item removal
  //   this.totalPrice = this.getTotalPrice();
  // }
  
  // updateQuantity(index: number, change: number) {
  //   if (this.cartItems[index].quantity + change > 0) {
  //     this.cartItems[index].quantity += change;
  //   }
  // }
  updateQuantity(index: number, change: number) {
    const updatedQty = this.cartItems[index].quantity + change;
    if (updatedQty > 0) {
      this.cartItems[index].quantity = updatedQty;
      this.cartItems = [...this.cartItems]; // <-- Trigger change detection
    }
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


// ✅ Open Address Modal Before Payment
openAddressModal() {
  const modalElement = document.getElementById('addressModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// ✅ Validate & Proceed to Payment
confirmAddress() {
  if (!this.userAddress.flatNo || !this.userAddress.landmark || !this.userAddress.area || !this.userAddress.mobile) {
    // alert("Please fill all address fields!");
    this.showErrorMsg = true;
    
    return;
  }
  this.showErrorMsg = false;
  // Close Modal & Proceed to Payment
  const modalElement = document.getElementById('addressModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  this.placeOrder();
}


  async placeOrder() {
    const cartItems = this.cartService.getCartItemsSnapshot();
  
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    console.log("Cart Items:", cartItems); // Debugging

    // ✅ Ensure Address Fields Are Filled
  if (
    !this.userAddress.flatNo.trim() || 
    !this.userAddress.landmark.trim() || 
    !this.userAddress.area.trim() || 
    !this.userAddress.mobile.trim()
  ) {
    alert("Please fill all address fields!");
    return;
  }

  console.log("User Address:", this.userAddress);
  // return this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}, Subtotal: ${price * quantity}`);
    // return sum + item.price;
    return this.cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }, 0);
  
  // return this.cartItems.reduce((sum, item) => sum + item.price, 0);
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
    console.log("Initializing Razorpay with amount:", totalAmount);
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
      userMobile: this.userAddress.mobile, // ✅ Save user mobile number
      deliveryAddress: {
        flatNo: this.userAddress.flatNo,
        landmark: this.userAddress.landmark,
        area: this.userAddress.area
      },
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
  getCartQuantity(product: any): number {
    let quantity = 0;
    this.cartService.getCartItems().subscribe(cart => {
      const item = cart.find(p => p.id === product.id);
      quantity = item ? item.quantity : 0;
    });
    return quantity;
  }
  increaseQuantity(product?: any) {
    if (product) {
      let quantity = this.getCartQuantity(product) + 1;
      this.cartService.addToCart({ ...product, quantity });
    }
    //  else {
    //   this.cartItemQuantity++;
    //   this.cartService.addToCart({ ...this.product, quantity: this.cartItemQuantity });
    // }
  }
  decreaseQuantity(product?: any) {
    if (product) {
      let quantity = this.getCartQuantity(product);
      if (quantity > 1) {
        this.cartService.addToCart({ ...product, quantity: quantity - 1 });
      } else {
        this.cartService.removeFromCart(product.id);
      }
    }
    //  else {
    //   if (this.cartItemQuantity > 1) {
    //     this.cartItemQuantity--;
    //     this.cartService.addToCart({ ...this.product, quantity: this.cartItemQuantity });
    //   } else {
    //     this.cartService.removeFromCart(this.product.id);
    //     this.cartItemQuantity = 0;
    //   }
    // }
  }
}
