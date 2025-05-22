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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  riceVarieties: RiceVariety[] = [];
  products: Product[] = [];             // All products from service
  filteredProducts: Product[] = [];     // Filtered based on search
  searchTerm: string = '';
  
  // products = [
  //   { id: 1, name: 'Basmati Rice', price: 120, image: 'assets/images/basmati.jpg' },
  //   { id: 2, name: 'Brown Rice', price: 90, image: 'assets/images/sri.webp' },
  //   { id: 3, name: 'Jasmine Rice', price: 150, image: 'assets/images/ind.webp' }
  // ];
  categorizedProducts: { [category: string]: Product[] } = {};
  categoryKeys: string[] = [];
  selectedCategory: string = '';
  placeholderTexts: string[] = [
    'Search for "Basmati Rice..."',
    'search for "Potato..."',
    'Search for "Milk..."',
    'search for "Tomatoes..."',
    'Search for "Kolam Rice..."'
  ];
  currentPlaceholder: string = this.placeholderTexts[0];
  private placeholderIndex = 0;

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
    this.rotatePlaceholder();
  }
  rotatePlaceholder() {
    setInterval(() => {
      this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholderTexts.length;
      this.currentPlaceholder = this.placeholderTexts[this.placeholderIndex];
    }, 2000);
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
    this.searchTerm = ''; 
    this.filterProductsBySearch();
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
  
  // filterProductsBySearch() {
  //   const term = this.searchTerm.trim().toLowerCase();
  
  //   if (this.selectedCategory && this.categorizedProducts[this.selectedCategory]) {
  //     const originalList = this.categorizedProducts[this.selectedCategory];
  
  //     if (term === '') {
  //       // If search is empty, show all products in selected category
  //       this.filteredProducts = [...originalList];
  //     } else {
  //       // Else, filter by product name
  //       this.filteredProducts = originalList.filter(product =>
  //         product.name.toLowerCase().includes(term)
  //       );
  //     }
  //   } else {
  //     this.filteredProducts = [];
  //   }
  // }
  
  filterProductsBySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = [];
  
    if (term === '') return;
  
    // Search across all categories
    Object.keys(this.categorizedProducts).forEach(category => {
      const matches = this.categorizedProducts[category].filter(product =>
        product.name.toLowerCase().includes(term)
      );
      this.filteredProducts.push(...matches);
    });
  }
  
  onSearchChange() {
    if (this.searchTerm.trim() !== '') {
      this.filterProductsBySearch();
    } else {
      this.filteredProducts = [];
    }
  }
  
}
