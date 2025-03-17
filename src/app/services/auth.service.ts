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


// import { Injectable } from '@angular/core';
// import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
// import { Router } from '@angular/router';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
// import { switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private userSubject = new BehaviorSubject<{ uid: string; email: string | null; role: string } | null>(null);
//   user$ = this.userSubject.asObservable();

//   constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
//     onAuthStateChanged(this.auth, async (user) => {
//       if (user) {
//         const role = await this.getUserRole(user.uid);
//         const userData = { uid: user.uid, email: user.email, role };
//         localStorage.setItem('user', JSON.stringify(userData)); // Store user with role
//         console.log('User logged in:', userData);
//         this.userSubject.next(userData);
//       } else {
//         localStorage.removeItem('user');
//         this.userSubject.next(null);
//       }
//     });
//   }

//   // 🔹 Sign Up & Save Role in Firestore
//   async signUp(email: string, password: string, role: string = 'user') {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//       await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
//         email,
//         role,  // 🔹 Store role in Firestore
//       });
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 🔹 Login & Fetch Role from Firestore
//   async login(email: string, password: string) {
//     try {
//       const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
//       const role = await this.getUserRole(userCredential.user.uid);
//       const userData = { uid: userCredential.user.uid, email: userCredential.user.email, role };
//       localStorage.setItem('user', JSON.stringify(userData));
//       this.userSubject.next(userData);
//       return userData;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 🔹 Logout
//   async logout() {
//     await signOut(this.auth);
//     localStorage.removeItem('user');
//     this.userSubject.next(null);
//     this.router.navigate(['/auth']);
//   }

//   // 🔹 Fetch User Role from Firestore
//   private async getUserRole(uid: string): Promise<string> {
//     const userDocRef = doc(this.firestore, 'admins', uid);
//     const userDoc = await getDoc(userDocRef);
  
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       console.log('Firestore User Data:', userData); // ✅ Debug Firestore data
//       console.log('User Role from Firestore:', userData['role']); // ✅ Debug role field
//       return userData['role'] || 'user';
//     }
  
//     console.warn(`No user document found for UID: ${uid}`);
//     return 'user'; // Default role if not found
//   }
  

//   // 🔹 Get Current User with Role
//   getCurrentUser(): Observable<{ uid: string; email: string | null; role: string } | null> {
//     return this.user$;
//   }
// }

import { Injectable } from '@angular/core';
import { Auth,sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<{ uid: string; email: string | null; role: string; name?: string; address?: string } | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userData = await this.getUserRole(user.uid);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user details locally
        console.log('User logged in:', userData);
        this.userSubject.next(userData);
      } else {
        localStorage.removeItem('user');
        this.userSubject.next(null);
      }
    });
  }
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return 'Reset link sent! Check your email.';
    } catch (error) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  }
  // 🔹 Signup: Store user data in Firestore
  async signUp(name: string, email: string, password: string, address: string,mobile: string, role: string = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);
        alert('Verification email sent. Please check your inbox.');

      // Save user details in Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), { name, email, address, mobile, role });

      return user;
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  }

  // 🔹 Login: Fetch user role from Firestore
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.getUserRole(userCredential.user.uid);
      const user = userCredential.user;

      if (!user.emailVerified) {
        throw new Error('Please verify your email before logging in.');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      this.userSubject.next(userData);
      return userData;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  async resendVerificationEmail() {
    const user = this.auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert('Verification email resent. Please check your inbox.');
    }
  }
  // 🔹 Logout
  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
  }

  // 🔹 Fetch user data from Firestore (checks both `admins` and `users` collections)
  private async getUserRole(uid: string): Promise<{ uid: string; email: string | null; role: string; name?: string; address?: string, mobile?: string; }> {
    // Check `admins` collection first
    let userDocRef = doc(this.firestore, 'admins', uid);
    let userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Admin found:', userData);
      return { uid, email: userData['email'] || null, role: 'admin', name: userData['name'], address: userData['address'], mobile: userData['mobile'] || null };
    }

    // If not an admin, check `users` collection
    userDocRef = doc(this.firestore, 'users', uid);
    userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User found:', userData);
      return { uid, email: userData['email'] || null, role: 'user', name: userData['name'], address: userData['address'], mobile: userData['mobile'] || null };
    }

    console.warn(`No user document found for UID: ${uid}`);
    return { uid, email: null, role: 'user' }; // Default role
  }

  // 🔹 Get Current User as an Observable
  getCurrentUser(): Observable<{mobile?:string, uid: string; email: string | null; role: string; name?: string; address?: string } | null> {
    return this.user$;
  }
}

