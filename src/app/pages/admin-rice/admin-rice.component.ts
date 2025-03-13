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
}
