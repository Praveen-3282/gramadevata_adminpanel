import { Component } from '@angular/core';
import { VillagesService } from '../services/villages.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-villages',
  imports: [CommonModule],
  templateUrl: './villages.component.html',
  styleUrl: './villages.component.css'
})
export class VillagesComponent {
  villages: any;
  selectedVillage: any=null
  constructor(private villageservice: VillagesService, private router: Router) {

  }
  ngOnInit(){
    this.getInactiveVillages();
  }

    getInactiveVillages() {
      this.villageservice.GetallinactiveVillages().subscribe(
        (data) => {
          console.log("Inactive villages fetched:", data);
          this.villages = data.sort(
            
          ); // adjust the key based on API response
        },
        (error) => {
          console.error("Error fetching inactive villages:", error);
        }
      );
    }
  
  navigateToVillage(village: any){
    this.selectedVillage = village;
  }

  navigateToVilage(_id: string){
    this.router.navigate(['edit_village', _id])
  }
}
