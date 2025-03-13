import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initializeApp, provideFirebaseApp, FirebaseOptions  } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { HomeComponent } from './app/pages/home/home.component';
import { AppComponent } from './app/app.component';
import { AdminDashboardComponent } from './app/pages/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './app/pages/cart/cart.component';
import { CheckoutComponent } from './app/pages/checkout/checkout.component';
import { ProductDetailsComponent } from './app/pages/product-details/product-details.component';
import { AuthComponent } from './app/pages/auth/auth.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';
import { OrderHistoryComponent } from './app/pages/order-history/order-history.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminRiceComponent } from './app/pages/admin-rice/admin-rice.component';

// ✅ Firebase configuration (replace with your own Firebase keys)
const firebaseConfig = {
  apiKey: 'AIzaSyCn-CzgMIw20Wk_rioS94FIkoBkgubTb5E',
  authDomain: 'rice-7cdca.firebaseapp.com',
  projectId: 'rice-7cdca',
  storageBucket: 'rice-7cdca.appspot.com',
  messagingSenderId: '216937022836',
  appId: '1:216937022836:web:7d0c92dba750ce81e55821'
};

const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [AuthGuard]  },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent,canActivate: [AuthGuard]  },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'admin-rice', component: AdminRiceComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(CommonModule,FormsModule,HttpClientModule),

    // ✅ Provide Firebase services directly
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ]
}).catch(err => console.error(err));
