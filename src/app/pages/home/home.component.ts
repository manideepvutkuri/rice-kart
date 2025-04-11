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
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

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
  categorizedProducts: { [category: string]: Product[] } = {};
  categoryKeys: string[] = [];
  selectedCategory: string = '';

  constructor(private router: Router,public cartService: CartService,private adminRiceService: AdminRiceService,private productService: ProductService) {}
  ngOnInit(): void {
    this.adminRiceService.getAllRiceVarieties().subscribe((rice) => {
      this.riceVarieties = rice;
  
      // Convert RiceVariety[] to Product[]
      const riceAsProducts: Product[] = rice.map(item => ({
        id: item.id || '',                      // Ensure string
    name: item.name || 'Unnamed Rice',
    price: item.price || 0,
    imageUrl: item.imageUrl || 'assets/images/default-rice.jpg', // fallback image
    description: item.description || 'High-quality rice',
    category: 'Rice'
      }));
  
      this.categorizedProducts['Rice'] = riceAsProducts;
  
      this.loadOtherProducts();
    });
  }
  
  loadOtherProducts() {
    this.productService.getAllProducts().subscribe((products: Product[]) => {
      products.forEach(product => {
        const category = product.category || 'Other';
        
        if (!this.categorizedProducts[category]) {
          this.categorizedProducts[category] = [];
        }
  
        this.categorizedProducts[category].push(product);
      });
  
      this.categoryKeys = Object.keys(this.categorizedProducts);
  
      // Default to first available category if not already set
      if (!this.selectedCategory && this.categoryKeys.length > 0) {
        this.selectedCategory = this.categoryKeys[0];
      }
    });
  }
    
  // viewProduct(product: any) {
  //   this.router.navigate(['/product', product.id], { state: { product } });
  // }
  viewDetails(rice: RiceVariety) {
    this.router.navigate(['/product', rice.id], { state: { product: rice } });
  }
  filterCategory(cat: string) {
    this.selectedCategory = cat;
  }
  exploreProducts(){}
  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      rice: 'bi-basket2-fill text-success',
      dairy: 'bi-cup-straw text-warning',
      vegetables: 'bi bi-egg-fried text-danger'
      // You can add more specific icons later if needed
    };
  
    return iconMap[category.toLowerCase()] || 'bi-tag text-secondary';
  }
  
}
