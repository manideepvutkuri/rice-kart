import { Component, OnInit } from '@angular/core';
import { AdminRiceService } from '../../services/admin-rice.service';
import { RiceVariety } from '../../models/rice-variety.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-rice',
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-rice.component.html',
  styleUrls: ['./admin-rice.component.css']
})
export class AdminRiceComponent implements OnInit {
  riceVarieties: RiceVariety[] = [];
  newRiceVariety: RiceVariety = { name: '', price: 0, description: '', imageUrl: '' };
  selectedFile: File | null = null;
  isEditing: boolean | undefined;
  selectedRice: any;

  constructor(private adminRiceService: AdminRiceService) {}

  ngOnInit() {
    this.loadRiceVarieties();
  }

  loadRiceVarieties() {
    this.adminRiceService.getAllRiceVarieties().subscribe(data => {
      this.riceVarieties = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async addRiceVariety() {
    // if (this.selectedFile) {
    //   this.newRiceVariety.imageUrl = await this.adminRiceService.uploadImage(this.selectedFile);
    // }

    this.adminRiceService.addRiceVariety(this.newRiceVariety).then(() => {
      this.newRiceVariety = { name: '', price: 0, description: '', imageUrl: '' };
      this.selectedFile = null;
      this.loadRiceVarieties();
    });
  }
  editRiceVariety(rice: RiceVariety) {
    this.selectedRice = { ...rice }; // Copy data to a temporary object
    this.isEditing = true; // Show the update form
  }
  
  updateRiceVariety() {
    if (this.selectedRice && this.selectedRice.id) {
      this.adminRiceService.updateRiceVariety(this.selectedRice.id, this.selectedRice)
        .then(() => {
          console.log("Rice variety updated successfully!");
          this.isEditing = false;
        })
        .catch(error => console.error("Error updating:", error));
    }
  }
  
  cancelEdit() {
    this.isEditing = false;
    this.selectedRice = null;
  }
  deleteRiceVariety(id: string) {
    if (confirm("Are you sure you want to delete this rice variety?")) {
      this.adminRiceService.deleteRiceVariety(id)
        .then(() => console.log("Rice variety deleted!"))
        .catch(error => console.error("Error deleting:", error));
    }
  }
  
}
