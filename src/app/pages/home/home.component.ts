// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent {
//   products = [
//     { id: 1, name: 'Basmati Rice', price: 120, image: 'assets/images/basmati.jpg' },
//     { id: 2, name: 'Brown Rice', price: 90, image: 'assets/images/sri.webp' },
//     { id: 3, name: 'Jasmine Rice', price: 150, image: 'assets/images/ind.webp' }
//   ];
//   constructor(private router: Router) {}

//   viewProduct(product: any) {
//     this.router.navigate(['/product', product.id], { state: { product } });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AdminRiceService } from '../../services/admin-rice.service';
import { RiceVariety } from '../../models/rice-variety.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  riceVarieties: RiceVariety[] = [];
  // products = [
  //   { id: 1, name: 'Basmati Rice', price: 120, image: 'assets/images/basmati.jpg' },
  //   { id: 2, name: 'Brown Rice', price: 90, image: 'assets/images/sri.webp' },
  //   { id: 3, name: 'Jasmine Rice', price: 150, image: 'assets/images/ind.webp' }
  // ];

  constructor(private router: Router,public cartService: CartService,private adminRiceService: AdminRiceService) {}
  ngOnInit(): void {
    this.adminRiceService.getAllRiceVarieties().subscribe((rice) => {
      this.riceVarieties = rice;
    });
  }
  // viewProduct(product: any) {
  //   this.router.navigate(['/product', product.id], { state: { product } });
  // }
  viewDetails(rice: RiceVariety) {
    this.router.navigate(['/product', rice.id], { state: { product: rice } });
  }
}
