import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe((data) => {
      this.orders = data;
    });
  }
  fetchOrders() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      console.log("Fetched orders:", this.orders);
    });
  }
  updateOrderStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).then(() => {
      console.log(`Order ${orderId} updated to ${newStatus}`);
    }).catch(error => {
      console.error("Error updating order status:", error);
    });
  }
}
