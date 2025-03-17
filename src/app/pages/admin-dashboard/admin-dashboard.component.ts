import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Howl } from 'howler'; // Import Howler for sound
import { MatSnackBar } from '@angular/material/snack-bar'; // Import Snackbar for notifications

@Component({
  selector: 'app-admin-dashboard',
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  orders: any[] = [];
  previousOrderIds: Set<string> = new Set();

  constructor(private orderService: OrderService,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe((data) => {
      const newOrders = data.filter(order => !this.previousOrderIds.has(order.id));

      if (newOrders.length > 0) {
        this.playNotificationSound(); // Play sound only for new orders
        this.showNewOrderNotification(newOrders.length); // Show notification
      }

      // Update order list and store the latest order IDs
      this.orders = data;
      this.previousOrderIds = new Set(data.map(order => order.id));
    });
  }

  playNotificationSound() {
    const sound = new Howl({
      src: ['assets/notification.mp3'], // Ensure this file exists in `src/assets/`
      volume: 1.0
    });
    sound.play();
  }

  // 🔔 Show Snackbar Notification
  showNewOrderNotification(orderCount: number) {
    this.snackBar.open(`🚀 ${orderCount} New Order(s) Placed!`, 'View', {
      duration: 5000 // ✅ Now correctly formatted
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
