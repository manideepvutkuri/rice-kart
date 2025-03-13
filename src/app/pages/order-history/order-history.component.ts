import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports:[CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log("User is logged in:", user.uid);
        this.fetchOrders(user.uid);
      } else {
        console.log("No user logged in.");
        this.orders = [];
      }
    });
  }
  
  fetchOrders(userId: string) {
    this.orderService.getUserOrders(userId).subscribe(orders => {
      console.log("Order history fetched:", JSON.stringify(orders, null, 2)); // ✅ Debugging
      this.orders = orders;
    }, error => {
      console.error("Error fetching orders:", error);
    });
  }
  
  
}
