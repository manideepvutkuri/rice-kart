// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CartService } from '../../services/cart.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-product-details',
//   imports:[CommonModule],
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.css']
// })
// export class ProductDetailsComponent implements OnInit {
//   product: any;

//   constructor(private route: ActivatedRoute, private cartService: CartService,private router: Router) {}

//   ngOnInit() {
//     // Get data from navigation state
//     const navigation = this.router.getCurrentNavigation();
//     this.product = navigation?.extras.state ? (navigation.extras.state as any)['product'] : null;

//     if (!this.product) {
//       // Fallback if user directly accesses the URL
//       const productId = this.route.snapshot.paramMap.get('id');
//       this.loadProductDetails(productId);
//     }
//   }

//   loadProductDetails(productId: string | null) {
//     // Replace this with actual fetching logic
//     const allProducts = [
//       { id: 1, name: 'Basmati Rice', price: 120, image: 'assets/images/basmati.jpg' },
//       { id: 2, name: 'Brown Rice', price: 90, image: 'assets/images/sri.webp' },
//       { id: 3, name: 'Jasmine Rice', price: 150, image: 'assets/images/ind.webp' }
//     ];
    
//     this.product = allProducts.find(p => p.id == Number(productId));
//   }

//   buyProduct(product: any) {
//     this.cartService.addToCart(product);
//     this.router.navigate(['/cart']);
//     console.log('Product added to cart:', product); // Debugging log
//   }
//   goBack() { window.history.back(); // Navigates back to the previous page 
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AdminRiceService } from '../../services/admin-rice.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-details',
  imports:[CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  similarProducts: any[] = [];
  cartItemQuantity: number = 0;

  constructor(private route: ActivatedRoute, private cartService: CartService, private router: Router, private adminRiceService: AdminRiceService,) {}

  ngOnInit() {
    // 1️⃣ Try to get product from navigation state
    if (history.state.product) {
      this.product = history.state.product;
      this.loadSimilarProducts();
      this.checkCart();
    } else {
      // 2️⃣ If no state, get productId from route and fetch it
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.adminRiceService.getAllRiceVarieties().subscribe(products => {
          this.product = products.find(p => p.id === productId);
          if (this.product) {
            this.loadSimilarProducts(products);
          } else {
            this.router.navigate(['/']); // Redirect to home if product not found
          }
        });
      } else {
        this.router.navigate(['/']); // Redirect if no product ID is found
      }
    }
  }
  checkCart() {
    this.cartService.getCartItems().subscribe(cart => {
      const item = cart.find((p: any) => p.id === this.product.id);
      this.cartItemQuantity = item ? item.quantity : 0;
    });
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
    } else {
      this.cartItemQuantity++;
      this.cartService.addToCart({ ...this.product, quantity: this.cartItemQuantity });
    }
  }

  decreaseQuantity(product?: any) {
    if (product) {
      let quantity = this.getCartQuantity(product);
      if (quantity > 1) {
        this.cartService.addToCart({ ...product, quantity: quantity - 1 });
      } else {
        this.cartService.removeFromCart(product.id);
      }
    } else {
      if (this.cartItemQuantity > 1) {
        this.cartItemQuantity--;
        this.cartService.addToCart({ ...this.product, quantity: this.cartItemQuantity });
      } else {
        this.cartService.removeFromCart(this.product.id);
        this.cartItemQuantity = 0;
      }
    }
  }

  loadSimilarProducts(products?: any[]) {
    if (!products) {
      // Fetch all products if not already loaded
      this.adminRiceService.getAllRiceVarieties().subscribe(allProducts => {
        this.filterSimilarProducts(allProducts);
      });
    } else {
      this.filterSimilarProducts(products);
    }
  }

  filterSimilarProducts(products: any[]) {
    this.similarProducts = products.filter(p =>
      p.id !== this.product.id && p.category === this.product.category
    );
  }

  buyProduct(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
    // this.router.navigate(['/cart']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
}
