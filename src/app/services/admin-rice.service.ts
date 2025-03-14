import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { RiceVariety } from '../models/rice-variety.model';

@Injectable({
  providedIn: 'root',
})
export class AdminRiceService {
  private collectionName = 'riceVarieties';

  constructor(private firestore: Firestore, private storage: Storage, private ngZone: NgZone) {}

  // Upload Image to Firebase Storage and return URL
  // async uploadImage(file: File): Promise<string> {
  //   const filePath = `rice-images/${file.name}`;
  //   const storageRef = ref(this.storage, filePath);
  //   await uploadBytes(storageRef, file);
  //   return getDownloadURL(storageRef);
  // }

  // Add a new rice variety
  addRiceVariety(riceVariety: RiceVariety) {
    const riceCollection = collection(this.firestore, this.collectionName);
    return addDoc(riceCollection, riceVariety);
  }

  // Fetch all rice varieties
  // getAllRiceVarieties(): Observable<RiceVariety[]> {
  //   const riceCollection = collection(this.firestore, this.collectionName);
  //   return collectionData(riceCollection, { idField: 'id' }) as Observable<RiceVariety[]>;
  // }

  getAllRiceVarieties(): Observable<RiceVariety[]> {
    return this.ngZone.runOutsideAngular(() => {  // ✅ Prevent zone issues
      const riceCollection = collection(this.firestore, this.collectionName);
      return collectionData(riceCollection, { idField: 'id' }) as Observable<RiceVariety[]>;
    });
  }

  // Update rice variety
  updateRiceVariety(id: string, data: Partial<RiceVariety>) {
    const riceDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(riceDoc, data);
  }

  // Delete rice variety
  deleteRiceVariety(id: string) {
    const riceDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(riceDoc);
  }
}
