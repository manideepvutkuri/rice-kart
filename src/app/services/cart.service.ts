import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartSubject = new BehaviorSubject<any[]>(this.cartItems); // Observable Cart

  constructor() { }

  // Add item to cart
  addToCart(product: any) {
    console.log('adding to cart');

    console.log(this.cartItems);
    console.log(product);

    const producIndex = this.cartItems.findIndex(d => d.id === product.id)
    if (producIndex == -1) {
      this.cartItems.push(product);
    } else {
      this.cartItems[producIndex].quantity = this.cartItems[producIndex].quantity + 1
    }

    this.cartSubject.next(this.cartItems); // Update subscribers
    console.log('Cart Items:', this.cartItems);
  }

  reduceCartQuantity(product:any){
    const producIndex = this.cartItems.findIndex(d => d.id === product.id)
    if (producIndex !== -1) {
      this.cartItems[producIndex].quantity = this.cartItems[producIndex].quantity - 1
      this.cartSubject.next(this.cartItems); // Update subscribers
    }
  }
  // Get cart items as Observable (for live updates)
  getCartItems(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }

  // Get current cart value as array
  getCartItemsSnapshot(): any[] {
    return this.cartItems;
  }

  // Remove item from cart
  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.cartSubject.next(this.cartItems); // Update subscribers
  }

  // Clear all items from cart
  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems); // Update subscribers
  }

  // Get total cart price
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  // Get cart count as Observable
  getCartItemCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(map(items => items.length));
  }

  updateCart(updatedCart: any[]) {
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
  }


}
