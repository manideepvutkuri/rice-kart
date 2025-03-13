import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, updateDoc, doc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { query, where, orderBy } from '@angular/fire/firestore';

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  [key: string]: any; // ✅ Allow other dynamic properties
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore, private authService: AuthService, private ngZone: NgZone) {}

  async placeOrder(orderData: any) {
    try {
      const currentUser = await firstValueFrom(this.authService.getCurrentUser());
      if (!currentUser) throw new Error("User not logged in");

      const order = {
        ...orderData,
        userId: currentUser.uid, // ✅ Attach user ID
        userEmail: currentUser.email,
      };

      const orderRef = collection(this.firestore, 'orders');
      await addDoc(orderRef, order);
      console.log("Order saved:", order);
    } catch (error) {
      console.error("Order placement error:", error);
      throw error;
    }
  }
  getOrders(): Observable<any[]> {
    const orderRef = collection(this.firestore, 'orders'); // Reference to 'orders' collection
    return collectionData(orderRef, { idField: 'id' }); // Fetch orders with document IDs
  }
 

  getUserOrders(userId: string): Observable<any[]> {
    return new Observable(observer => {
      this.ngZone.runOutsideAngular(() => {
        const orderRef = collection(this.firestore, 'orders');
        const userOrdersQuery = query(orderRef, where("userId", "==", userId));
        collectionData(userOrdersQuery, { idField: 'id' }).subscribe(data => {
          this.ngZone.run(() => observer.next(data));
        });
      });
    });
  }
  
  updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
    const orderRef = doc(this.firestore, `orders/${orderId}`);
    return updateDoc(orderRef, { status: newStatus });
  }

}
