import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-temples',
  imports: [CommonModule, NzSelectModule],
  templateUrl: './temples.component.html',
  styleUrl: './temples.component.css'
  
})
export class TemplesComponent {
  temples: any;
  selectedTemple: any = null;
  nearbytemples: any;
  blockId: any;
  templeId: any;
  CategoryOptions: { label: string; value: string }[] = [];
  selectedCategoryId:any;
  isConnected = false;
  templedata: any;
  ConnectionData: any;
  selectedImage: any;
  connectedId: any;
  villageid:any;

  constructor(private templeservice: TempleService, private router: Router, private authenticationservice: AuthenticationService){}

  ngOnInit(): void{
    this.fetchallTemples();
    this.getAllCategories();
  }

  fetchallTemples(): void {
    this.templeservice.getalltemples().subscribe({
      next: (data) => {
        this.temples = data.results.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        console.log('All temples (sorted):', this.temples);
      },
      error: (error) => {
        console.error('Error fetching temples:', error);
      }
    });
  }
  
  selectTemple(temple: any): void {
    this.selectedTemple = temple;
    this.villageid = temple.object_id
    console.log(this.villageid,"23121323435")
    this.templeservice.filterTemple('', this.villageid).subscribe(
      (filterData: any) => {
        const filteredResults = filterData.results.filter(
          (temple: any) => temple._id !== this.templeId
        );
        this.nearbytemples = filteredResults;
        
        console.log("Nearby Temples:", this.nearbytemples);
      },
      (filterError: any) => {
        console.error("Error fetching nearby temples", filterError);
      }
    );
    
  }

  navigatetemple(templeId: any): void{
    this.router.navigate(['temples', templeId])
  }

  editTemple(temple: any): void {
    this.router.navigate(['edit_temple',temple]);
  }
  

  handleImageError(event: Event){
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  getAllCategories(): void {
    this.templeservice.getallcategories().subscribe(
      (data: any) => {
        // Map the response data to create the category options
        this.CategoryOptions = data.map((country: any) => ({
          label: country.name,
          value: country._id
        }));
  
        // Add the "All Temples" option
        this.CategoryOptions.push({ label: 'All Temples', value: "" });
  
        // Define priority categories
        const priorityCategories = [
          "All Temples", "Jyotirlingas (12)", "Maha Sakthi peetas (18)", "Sakthi Peetas (54)", "Chardham (4)", "Chota Chardham (4)",
           "Divya Desam (108)", "Asta Vinayaka (8)", "Pancha Bhutha (5)", "Pancha Prayag (5)", "Pancharama (5)", "Pancha Kedar (5)",
           
        ];
  
        // Sort the categories to prioritize priority ones first, then by alphabetical order
        this.CategoryOptions.sort((a, b) => {
          // Check if either category is in the priority list and sort accordingly
          const priorityA = priorityCategories.indexOf(a.label);
          const priorityB = priorityCategories.indexOf(b.label);
  
          // If both categories are in the priority list, sort based on priority
          if (priorityA !== -1 && priorityB !== -1) {
            return priorityA - priorityB;
          }
  
          // If one category is in the priority list, it should come first
          if (priorityA !== -1) return -1;
          if (priorityB !== -1) return 1;
  
          // If neither category is in the priority list, fall back to alphabetical sorting
          return a.label.localeCompare(b.label);
        });
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  onSelectCategory(selectedValue: any): void {
    this.selectedCategoryId = selectedValue;
    console.log('Selected Category:', this.selectedCategoryId);  // Check if category is selected
    this.router.navigate(["globaltemples", this.selectedCategoryId]);
    if (this.selectedCategoryId ==='AllTemples') {
      console.log(this.selectedCategoryId,"poiuy")
      this.selectedCategoryId = '';
    }
    // this.applyFilters();  // Trigger applyFilters after category selection
  }
  


  fecthtempledata(): void {
    this.isConnected = false;
    let userId = this.authenticationservice.getCurrentUser();
    
    if (userId == undefined || userId == null) {
      this.authenticationservice.showLoginModal();
      return;
    }
  
    if (!this.templeId) {
      console.error("Temple ID is not defined.");
      return;
    }
  
    this.templeservice.getbytemple(this.templeId).subscribe(
      (data: any) => {
        console.log("API Response Data:", data); // Log the data received from the API
  
        if (!data || data.length === 0) {
          console.error("templedata is not defined or empty");
          return;
        }
  
        this.templedata = data;
        this.blockId = this.templedata[0]?.object_id?.block?.block_id;
        this.ConnectionData = this.templedata[0]?.Connections;
  
        console.log("Connection Data:", this.ConnectionData);
        console.log("Block ID:", this.blockId);
  
        // Check for blockId before making filtertemples call
        if (!this.blockId) {
          console.error("Block ID is not defined.");
          return;
        }

        console.log(this.templedata[0].image_location[0],'this.templedata.image_location')

        if (this.templedata[0].image_location[0] && this.templedata[0].image_location[0].length > 0) {
          this.selectedImage = this.templedata[0].image_location[0]; // Default to the first image
        } else {
          this.selectedImage = 'assets/ohm.jpg'; 
        }
  
        this.templeservice.filterTemple('', this.blockId).subscribe(
          (filterData: any) => {
            const filteredResults = filterData.results.filter(
              (temple: any) => temple._id !== this.templeId
            );
            this.nearbytemples = filteredResults;
            console.log("Nearby Temples:", this.nearbytemples);
          },
          (filterError: any) => {
            console.error("Error fetching nearby temples", filterError);
          }
        );
  
        if (Array.isArray(this.ConnectionData)) {
          const connection = this.ConnectionData.find(
            (conn: any) => conn.user && conn.user._id === userId
          );
          if (connection) {
            this.isConnected = true;
            console.log("User is connected.",connection._id);
            this.connectedId = connection._id
          }
        } else {
          console.error("Connections is not defined or is not an array");
        }
      },
      (apiError: any) => {
        console.error("Error fetching temple data", apiError);
      }
    );
  }
  

  loadtempledata() {
    
    this.templedata = []; // Clear previous data
    
  }

  onImageClick(image: string): void {
    this.selectedImage = image; // Update the main image
  }

  
}
