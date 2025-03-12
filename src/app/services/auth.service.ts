// import { Injectable } from '@angular/core';
// import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, user } from '@angular/fire/auth';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private userSubject = new BehaviorSubject<User | null>(null);
//   user$ = this.userSubject.asObservable();

//   constructor(private auth: Auth, private router: Router) {
//     // Listen for authentication state changes
//     onAuthStateChanged(this.auth, (user) => {
//       this.userSubject.next(user);
//     });
//   }

//   // 🔹 Signup method
//   async signUp(email: string, password: string) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 🔹 Login method
//   async login(email: string, password: string) {
//     try {
//       const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
//       localStorage.setItem('user', JSON.stringify(userCredential.user)); // Store user in localStorage
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 🔹 Logout method
//   async logout() {
//     await signOut(this.auth);
//     localStorage.removeItem('user');
//     this.router.navigate(['/auth']); // Redirect to login page
//   }

//   getCurrentUser(): Observable<User | null> {
//     return user(this.auth);
//   }
// }


import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<{ uid: string; email: string | null; role: string } | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const role = await this.getUserRole(user.uid);
        const userData = { uid: user.uid, email: user.email, role };
        localStorage.setItem('user', JSON.stringify(userData)); // Store user with role
        console.log('User logged in:', userData);
        this.userSubject.next(userData);
      } else {
        localStorage.removeItem('user');
        this.userSubject.next(null);
      }
    });
  }

  // 🔹 Sign Up & Save Role in Firestore
  async signUp(email: string, password: string, role: string = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
        email,
        role,  // 🔹 Store role in Firestore
      });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Login & Fetch Role from Firestore
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const role = await this.getUserRole(userCredential.user.uid);
      const userData = { uid: userCredential.user.uid, email: userCredential.user.email, role };
      localStorage.setItem('user', JSON.stringify(userData));
      this.userSubject.next(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Logout
  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
  }

  // 🔹 Fetch User Role from Firestore
  private async getUserRole(uid: string): Promise<string> {
    const userDocRef = doc(this.firestore, 'admins', uid);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Firestore User Data:', userData); // ✅ Debug Firestore data
      console.log('User Role from Firestore:', userData['role']); // ✅ Debug role field
      return userData['role'] || 'user';
    }
  
    console.warn(`No user document found for UID: ${uid}`);
    return 'user'; // Default role if not found
  }
  

  // 🔹 Get Current User with Role
  getCurrentUser(): Observable<{ uid: string; email: string | null; role: string } | null> {
    return this.user$;
  }
}
