import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-temples',
  imports: [CommonModule, NzSelectModule,ReactiveFormsModule,NzFormModule,FormsModule],
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
  selectedMainCategoryId:any;
  searchText: string = '';



  constructor(private templeservice: TempleService, private router: Router, private authenticationservice: AuthenticationService,private route:ActivatedRoute,
    private locationservice:LocationService,private fb:FormBuilder,
  ){}

  ngOnInit(): void{
    this.selectedMainCategoryId = this.route.snapshot.paramMap.get('id');
    console.log(this.selectedCategoryId,"poiuy")
    // this.fetchallTemples();
    this.getAllCategories();
    this.loadlocations();



    const storedCategory = localStorage.getItem('selectedCategory');
if (storedCategory) {
  const categoryData = JSON.parse(storedCategory);
  this.selectedCategoryId = categoryData.id;
  this.searchText = categoryData.name; 
}
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
        
        console.log("Nearby temples:", this.nearbytemples);
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
        console.log("API Response Data:", data); 
  
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
  handleProfileImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profile1.webp';
  }




















////////////////////////////////////////////////////////////////////////location and categeory tag////////////////

  selectedLocationId: any;

  currentPage: number = 1;
  globaltemples: any[] = [];

  validatorForm!:FormGroup;

  StateOptions:any[]=[];
  DistrictOptions:any[]=[];
  MandalOptions:any[]=[];
  VillageOptions:any[]=[];
  CountryOptions: any[]=[];
  selectedCountry: string | null = null;
  selectedState: string | null = null;
  selectedVillage: string | null = null;
  selectedDistrict: string | null = null;
  selectedBlock: string | null = null;




  getAllCategories(): void {
    this.templeservice.getallcategories().subscribe(
      (data: any) => {
        this.CategoryOptions = data.map((country: any) => ({
          label: country.name,
          value: country._id
        }));
        this.CategoryOptions.push({ label: 'All Temples', value: "" });
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }




  onSelectCategory(selectedValue: any): void {
    this.selectedCategoryId = selectedValue;
    console.log('Selected Category:', this.selectedCategoryId);  // Check if category is selected


    this.applyFilters();
  }
  




  loadFilteredTemples() {
    if (this.selectedCategoryId && this.selectedLocationId) {
      console.log(this.selectedCategoryId,this.selectedLocationId,"sdfg")
        this.templeservice.filterTemple(this.selectedCategoryId, this.selectedLocationId, this.currentPage).subscribe(
            (response) => {
                this.globaltemples = [...this.globaltemples, ...response.results];
                console.log(this.globaltemples, "Filtered Temples with Category and Location");
            },
            (error) => {
                console.error('Error fetching Filtered Temples with Category and Location:', error);
            }
        );
    } else if (this.selectedCategoryId) {
      console.log("sdfg123")
        this.templeservice.filterTemple(this.selectedCategoryId, '').subscribe(
            (response) => {
                this.globaltemples = [...this.globaltemples, ...response.results];
                console.log(this.globaltemples, "Filtered Temples with Category");
            },
            (error) => {
                console.error('Error fetching Filtered Temples with Category:', error);
            }
        );
    }else if (this.selectedLocationId) {
      this.templeservice.filterTemple("",this.selectedLocationId, this.currentPage).subscribe(
          (response) => {
              this.globaltemples = [...this.globaltemples, ...response.results];
              console.log(this.globaltemples, "Filtered Temples with Location");
          },
          (error) => {
              console.error('Error fetching Filtered Temples with Location:', error);
          }
      );
  } 
    
    
    
    else {
      
        this.templeservice.getalltemples().subscribe(
            (response) => {
                this.globaltemples = [...this.globaltemples, ...response.results];
                console.log(this.globaltemples, "Filtered Temples without Category or Location");
            },
            (error) => {
                console.error('Error fetching filtered temples:', error);
            }
        );
    }


}


cleardata(){
  this.selectedCategoryId = []
}

onReset(): void {
  this.validatorForm.reset();
  this.selectedLocationId = null;
  // this.selectedCategoryId = null;
  this.applyFilters();
}

applyFilters() {
  this.currentPage = 1;
  this.globaltemples = []; // Clear previous data
  this.loadFilteredTemples();
}

clearState(): void {
  console.log("State cleared");
  this.validatorForm.get('state')?.setValue(null); // Clear state
  this.selectedLocationId = this.validatorForm.get('country')?.value || null;
  if (this.selectedLocationId) {
    this.applyFilters();
  }
}
cleardistrict(): void {
  console.log("District cleared");
  this.validatorForm.get('district')?.setValue(null);
  this.selectedLocationId = this.validatorForm.get('state')?.value || null;
  if (this.selectedLocationId) {
    this.applyFilters();
  }
}
clearmandal(): void {
  console.log("Mandal cleared");
  this.validatorForm.get('mandal')?.setValue(null);
  this.selectedLocationId = this.validatorForm.get('district')?.value || null;
  if (this.selectedLocationId) {
    this.applyFilters();
  }
}
clearvillage(): void {
  console.log("Village cleared");
  this.validatorForm.get('village')?.setValue(null);
  this.selectedLocationId = this.validatorForm.get('mandal')?.value || null;
  if (this.selectedLocationId) {
    this.applyFilters();
  }
}




loadlocations(): void {
  this.validatorForm = this.fb.group({
    country:['',[Validators.required]],
    state: ['', [Validators.required]],
    district: ['', Validators.required],
    mandal: ['', Validators.required],
    village: ['', Validators.required]
  });




  

  this.locationservice.GetAllCountries().subscribe(
    (res) => {
      if (Array.isArray(res)) {
        this.CountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id
        }));
        this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
  
        const defaultCountry = this.CountryOptions.find(option => option.label === 'India');
  
        if (defaultCountry) {
          this.validatorForm.controls['country'].setValue(defaultCountry.value);
        }
      } else {
        console.error("Response is not an array type", res);
      }
    },
    (err) => {
      console.log(err);
    }
  );
  
  // Handle country changes
  this.validatorForm.get('country')?.valueChanges.subscribe(CountryID => {
    if (CountryID) {
      this.selectedLocationId = CountryID; 
      this.applyFilters();
  
      this.resetFormControls();
      this.StateOptions = [];
      this.DistrictOptions = [];
      this.MandalOptions = [];
      this.VillageOptions = [];
      
     
  
      this.locationservice.getbyStates(CountryID).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.StateOptions = res.map((state: any) => ({
              label: state.name,
              value: state._id
            }));
            this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
  
            this.validatorForm.controls['state'].enable();
          } else {
            console.error("Response is not an array type", res);
          }
        },
        (err) => {
          console.log(err);
          this.resetFormControls();

        }
      );
      this.resetFormControls();

    }
    else {
      this.resetFormControls();
    }
  });
  
  
  

  // Handle state changes
  this.validatorForm.get('state')?.valueChanges.subscribe(stateID => {
    if (stateID) {
      this.selectedLocationId = stateID; 
      console.log('State ID selected:', this.selectedLocationId);
      this.applyFilters()

      this.locationservice.getdistricts(stateID).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.DistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id
            }));
            this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          } else {
            console.error("Response is not an array type", res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      this.resetDistrictMandalVillage();
      this.validatorForm.get('district')?.enable();
    } else {
      this.resetDistrictMandalVillage();
    }
  });

  // Handle district changes
  this.validatorForm.get('district')?.valueChanges.subscribe(districtID => {
    if (districtID) {
      this.selectedLocationId = districtID; 
      console.log('District ID selected:', this.selectedLocationId);
      this.applyFilters()
      this.locationservice.getblocks(districtID).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.MandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id
            }));
            this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          } else {
            console.error("Response is not an array type", res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      this.resetMandalVillage();
      this.validatorForm.get('mandal')?.enable();
    } else {
      this.resetMandalVillage();
    }
  });

  // Handle mandal changes
  this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalID => {
    if (mandalID) {
      this.selectedLocationId = mandalID; 
      console.log('Mandal ID selected:', this.selectedLocationId);
      this.applyFilters()
      this.locationservice.getvillages(mandalID).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.VillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id
            }));
            this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            
          } else {
            console.error("Response is not an array type", res);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      this.resetVillage();
    } else {
      this.resetVillage();
    }
  });

  this.validatorForm.get('village')?.valueChanges.subscribe(villageID => {
    // console.log("frwfffdcvf")
    if (villageID) {
      this.selectedLocationId = villageID; 
      this.applyFilters()
      console.log('Village ID selected:', this.selectedLocationId);
    } else {
      this.resetVillage();
    }
  });
}




resetFormControls(): void {
  this.validatorForm.get('state')?.reset();
  this.validatorForm.get('district')?.reset();
  this.validatorForm.get('mandal')?.reset();
  this.validatorForm.get('village')?.reset();

  // Clear the dropdown options to remove old data
  this.StateOptions = [];
  this.DistrictOptions = [];
  this.MandalOptions = [];
  this.VillageOptions = [];
}

resetDistrictMandalVillage(): void {
  this.validatorForm.get('district')?.reset();
  this.validatorForm.get('mandal')?.reset();
  this.validatorForm.get('village')?.reset();

  // Clear the dropdown options
  this.DistrictOptions = [];
  this.MandalOptions = [];
  this.VillageOptions = [];
}

resetMandalVillage(): void {
  this.validatorForm.get('mandal')?.reset();
  this.validatorForm.get('village')?.reset();

  // Clear the dropdown options
  this.MandalOptions = [];
  this.VillageOptions = [];
}

resetVillage(): void {
  this.VillageOptions=[]
  this.validatorForm.get('village')?.reset();

  // Clear the dropdown options
  this.VillageOptions = [];
}

onStateSelect(selectedValue: string) {
  this.selectedState = selectedValue ? selectedValue : null;
}


onDistrictSelect(selectedValue: string) {
  this.selectedDistrict = selectedValue ? selectedValue : null;
}

onBlockSelect(selectedValue: string) {
  this.selectedBlock =  selectedValue ? selectedValue : null;
}

onVillageSelect(selectedValue: string) {
  this.selectedVillage =  selectedValue ? selectedValue : null;
}





























  
}
