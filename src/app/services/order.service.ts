import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

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
}
