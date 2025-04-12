import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { TempleStyle,enumToMap } from '../enums/temple_style_enum';








import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { state } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-edit-temple',
  imports: [ReactiveFormsModule, CommonModule,NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './edit-temple.component.html',
  styleUrl: './edit-temple.component.css'
})
export class EditTempleComponent {

  updateTempleForm!: FormGroup;
  templeData:any;
  userId:any;
  templeId: any;
  bannerFileList: NzUploadFile[] = [];
  templeVillageOptions: any[] = [];
  village_id: any;
  templeCategoryOptions: any[] = [];
  templePriorityOptions: any[] = [];
  templeStyleOptions: any[] = [];
  containsLocationDetails = false;
  countries: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;
  templeMapLocation: string = '';
  InVillage = false;
  village: any;



  constructor(
    private templeService: TempleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,

  ) {


  }




  ngOnInit(): void {
    this.fetchAllPriority();
    this.fetchallCategorys();


    // this.getTempleDetails();
    const templeId = this.route.snapshot.paramMap.get('id');
    if (templeId) {
      this.getTempleDetails(templeId);
    }



    this.updateTempleForm = this.fb.group({
      
      name: ['', Validators.required],
      is_navagraha_established: [false],
      construction_year: [],
      is_destroyed: [false],
      animal_sacrifice_status: [false],
      diety: ['', Validators.required],
      style: [''],
      temple_map_location: ['', Validators.required],
      address: ['', Validators.required],
      desc: [''],
      status: ['INACTIVE'],
      image_location: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      country: ['', Validators.required],
      state: [{ value: '', disabled: true }, Validators.required],
      district: [{ value: '', disabled: true }, Validators.required],
      mandal: [{ value: '', disabled: true }, Validators.required],
      object_id: [{ value: this.village_id, disabled: true }, Validators.required],
      user: localStorage.getItem('user'),


      
    
  })

  if (this.village_id != null) {
    // Enable object_id before setting its value
    this.updateTempleForm.get('object_id')?.enable();

    // Strictly set the value using setValue
    try {
      this.updateTempleForm.get('object_id')?.setValue(this.village_id);
      console.log(this.updateTempleForm.get('object_id')?.value, "Updated object_id value");
    } catch (error) {
      console.error("Error setting object_id:", error);
    }

    // Clear validators for location fields
    this.updateTempleForm.get('country')?.clearValidators();
    this.updateTempleForm.get('state')?.clearValidators();
    this.updateTempleForm.get('district')?.clearValidators();
    this.updateTempleForm.get('mandal')?.clearValidators();
  } else {
    // When village_id is null, disable object_id and require location fields
    this.updateTempleForm.get('object_id')?.disable();
    this.updateTempleForm.get('country')?.setValidators(Validators.required);
    this.updateTempleForm.get('state')?.setValidators(Validators.required);
    this.updateTempleForm.get('district')?.setValidators(Validators.required);
    this.updateTempleForm.get('mandal')?.setValidators(Validators.required);
  }

  // Update validation status after changing validators
  this.updateTempleForm.get('country')?.updateValueAndValidity();
  this.updateTempleForm.get('state')?.updateValueAndValidity();
  this.updateTempleForm.get('district')?.updateValueAndValidity();
  this.updateTempleForm.get('mandal')?.updateValueAndValidity();
  this.updateTempleForm.get('object_id')?.updateValueAndValidity();

  

  // Fetch all countries and populate dropdown
  this.templeService.GetAllCountries().subscribe(
    (res) => {
      this.templeCountryOptions = res.map((country: any) => ({
        label: country.name,
        value: country._id,
      }));
      this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

      const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
      if (defaultCountry) {
        this.updateTempleForm.controls['country'].setValue(defaultCountry.value);
      }
    },
    (err) => {
      console.log(err);
    }
  );

  // Listen for changes in the country dropdown and update states accordingly
  this.updateTempleForm.get('country')?.valueChanges.subscribe(countryId => {
    this.resetFormFields(['state', 'district', 'mandal', 'object_id']);
    if (countryId) {
      this.templeService.getbyStates(countryId).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.templeStateOptions = res.map((state: any) => ({
              label: state.name,
              value: state._id,
            }));
            this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
          } else {
            console.error('Response is not an array:', res);
          }
        },
        (err) => console.log(err)
      );
      this.updateTempleForm.get('state')?.enable();
    }
  });

  // Listen for changes in the state dropdown and update districts accordingly
  this.updateTempleForm.get('state')?.valueChanges.subscribe(stateId => {
    this.resetFormFields(['district', 'mandal', 'object_id']);
    if (stateId) {
      this.templeService.getdistricts(stateId).subscribe(
        (res) => {
          this.templeDistrictOptions = res.map((district: any) => ({
            label: district.name,
            value: district._id,
          }));
          this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
        },
        (err) => console.log(err)
      );
      this.updateTempleForm.get('district')?.enable();
    }
  });

  // Listen for changes in the district dropdown and update mandals accordingly
  this.updateTempleForm.get('district')?.valueChanges.subscribe(districtId => {
    this.resetFormFields(['mandal', 'object_id']);
    if (districtId) {
      this.templeService.getblocks(districtId).subscribe(
        (res) => {
          this.templeMandalOptions = res.map((mandal: any) => ({
            label: mandal.name,
            value: mandal._id,
          }));
          this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
        },
        (err) => console.log(err)
      );
      this.updateTempleForm.get('mandal')?.enable();
    }
  });

  // Listen for changes in the mandal dropdown and update villages accordingly
  this.updateTempleForm.get('mandal')?.valueChanges.subscribe(mandalId => {
    this.updateTempleForm.get('object_id')?.reset();
    this.updateTempleForm.get('object_id')?.disable();
    if (mandalId) {
      this.templeService.getvillages(mandalId).subscribe(
        (res) => {
          this.templeVillageOptions = res.map((village: any) => ({
            label: village.name,
            value: village._id,
          }));
          this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateTempleForm.get('object_id')?.enable();
        },
        (err) => console.log(err)
      );
    }
  });

  this.templeStyleOptions = enumToMap(TempleStyle);
  this.updateTempleForm.controls['style'].setValue('O');

  this.formGroup = this.formBuilder.group({
    templeIsNavagraha: ['']
  });
}

// Utility function to reset and disable form fields
private resetFormFields(fields: string[]) {
  fields.forEach(field => {
    this.updateTempleForm.get(field)?.reset();
    this.updateTempleForm.get(field)?.disable();
  });

  }

  getTempleDetails(temple:string) {

    this.templeService.Editbytemplegetresponse(temple).subscribe((response:any) => {
     this. updateTempleForm = this.fb.group({
      name: response.name,
      temple_official_website: response.temple_official_website,
      temple_timings: response.temple_timings,
      image_location:response.image_location,
      status: response.status,
      desc: response.desc,
      contact_email:response.contact_email,
      contact_phone:response.contact_phone,
      contact_name:response.contact_name,
      address: response.address,
      temple_map_location:response.temple_map_location,
      diety: response.diety,
      is_navagraha_established: response.is_navagraha_established,
      is_destroyed: response.is_destroyed,
      created_at: response.created_at,
      animal_sacrifice_status: response. animal_sacrifice_status,
      construction_year: response.construction_year,
      category:response.category,
      object_id:response.object_id,
      mandal:response.mandal,
      district:response.district,
      state:response.state,
      country:response.country,

     })
    }
  );
  }
  
  // onSubmit() {
  //   const templeId = this.route.snapshot.paramMap.get('templeId');
  //   if (templeId) {
  //     this.templeService.updateTempleDetails(templeId, this.templeData).subscribe(
  //       response => {
  //         console.log('Temple updated successfully!', response);
  //       },
  //       error => {
  //         console.error('Error updating temple', error);
  //       }
  //     );
  //   }
  // }


  onSubmit(): void {
    console.log('Submit button clicked');
    const templeId = this.route.snapshot.paramMap.get('templeId');
    console.log('Temple ID:', templeId);

    if (templeId && this.templeData) {
      this.templeService.updateTempleDetails(templeId, this.templeData).subscribe({
        next: (response) => {
          console.log('Temple updated successfully!', response);
        },
        error: (error) => {
          console.error('Error updating temple', error);
        }
      });
    } else {
      console.warn('Temple ID or data is missing');
    }
  }
  

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateTempleForm.patchValue({
            temple_map_location: `https://www.google.com/maps?q=${lat},${lng}`,
          });
        },
        (error) => {
          console.error('Error getting location', error);
          alert('Unable to retrieve your location. Please try again.');
        },
        {
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0,  
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  handleBannerFileRemove(file: any): boolean {
    // Remove the file from the list
    this.bannerFileList = this.bannerFileList.filter(f => f.uid !== file.uid);
    return true;
  }

  handleBannerFileChange(info:NzUploadChangeParam):void {
    this.handleUpload(info, 'bannerImage');
   }
   handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];
  
    // Initialize an empty array to store base64 strings
    const base64Images: string[] = [];
  
    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        base64Images.push(base64String);
  
        // Update the form control once all images are processed
        if (base64Images.length === fileList.length) {
          this.updateTempleForm.patchValue({ image_location: base64Images });
          console.log('Updated images form:', this.updateTempleForm.value);
        }
      });
    });
  
    if (formControlName === 'bannerImage') {
      this.bannerFileList = fileList;
    }
  
    console.log('File upload:', info.fileList);
  }

  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result as string;
        // Extract base64 string without the data URI scheme
        base64String = base64String.split(',')[1];
        console.log('Base64 string:', base64String); // Print base64 string
        callback(base64String);
    };
    reader.readAsDataURL(file);
  }





  fetchAllPriority(): void {
    this.templeService.getpriority().subscribe((res) => {
      res.forEach((priority: any) => {
        this.templePriorityOptions.push({
          label: priority.name,
          value: priority._id,
        });
      });
    });
  }

  fetchallCategorys(): void {
    this.templeService.GetallCategories().subscribe(
      (res) => {
        res.forEach((category: any) => {
          this.templeCategoryOptions.push({
            label: category.name,
            value: category._id,
          });
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

 

  get deityList(): FormArray {
    return this.updateTempleForm.get('deityList') as FormArray;
  }
  
}
