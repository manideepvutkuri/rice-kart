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

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private cartService: CartService, private router: Router) {}

  ngOnInit() {
    // Get product details from navigation state
    if (history.state.product) {
      this.product = history.state.product;
    } else {
      // If user refreshes, redirect them back to home
      this.router.navigate(['/']);
    }
  }

  buyProduct(product: any) {
    this.cartService.addToCart(product);
    this.router.navigate(['/cart']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
