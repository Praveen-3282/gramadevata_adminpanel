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
import { state, style } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NotificationHelper } from '../notification';



@Component({
  selector: 'app-edit-temple',
  imports: [ReactiveFormsModule, CommonModule,NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgxSpinnerModule
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
  state:any;
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
  successMessage: string | null = null;
  errorMessage: string | null = null;



  constructor(
    private templeService: TempleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private notificationHelper: NotificationHelper,


  ) {

    
  }


  
  ngOnInit() {
    const templeId = this.route.snapshot.paramMap.get('id');
    console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",templeId)
    if (templeId) {
      this.getTempleDetails(templeId);
    }
    
    
    this.fetchallCategorys();
    this.fetchAllPriority();
    this.village_id = history.state.village_id || null;
    console.log(this.village_id, "this.village_id");
    

    this.updateTempleForm = this.fb.group({
      name: ['', Validators.required],
      is_navagraha_established: [false],
      construction_year: [],
      is_destroyed: [false],
      animal_sacrifice_status: [false],
      diety: ['', Validators.required],
      style: ['', Validators.required],
      temple_map_location: ['', Validators.required],
      address: ['', Validators.required],
      desc: [''],
      status: ['INACTIVE'],
      image_location: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      
      user: localStorage.getItem('user'),
      templeId :this.route.snapshot.paramMap.get("id"),
      temple_official_website: ['', [Validators.pattern('https?://.+')]],
      temple_timings: [''],
      temple_area: [''],
      contact_email: [''],
      contact_phone: [''],
      contact_name: [''],
       country: [''],         // ✅ Ensure this exists
      state: [''],           // ✅ Ensure this exists
      district: [''],        // ✅ Ensure this exists
      mandal: [''],          // ✅ Ensure this exists
      object_id: [''],       // ✅ Ensure this exists

    });


    if (this.village_id != null) {

      this.updateTempleForm.get('object_id')?.enable();


      try {
        this.updateTempleForm.get('object_id')?.setValue(this.village_id);
        console.log(this.updateTempleForm.get('object_id')?.value, "Updated object_id value");
      } catch (error) {
        console.error("Error setting object_id:", error);
      }

    
      this.updateTempleForm.get('country')?.clearValidators();
      this.updateTempleForm.get('state')?.clearValidators();
      this.updateTempleForm.get('district')?.clearValidators();
      this.updateTempleForm.get('mandal')?.clearValidators();
    } else {  

      this.updateTempleForm.get('object_id')?.disable();
      this.updateTempleForm.get('country')?.setValidators(Validators.required);
      this.updateTempleForm.get('state')?.setValidators(Validators.required);
      this.updateTempleForm.get('district')?.setValidators(Validators.required);
      this.updateTempleForm.get('mandal')?.setValidators(Validators.required);
    }


    this.updateTempleForm.get('country')?.updateValueAndValidity();
    this.updateTempleForm.get('state')?.updateValueAndValidity();
    this.updateTempleForm.get('district')?.updateValueAndValidity();
    this.updateTempleForm.get('mandal')?.updateValueAndValidity();
    this.updateTempleForm.get('object_id')?.updateValueAndValidity();

    

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

private resetFormFields(fields: string[]) {
  fields.forEach(field => {
    this.updateTempleForm.get(field)?.reset();
    this.updateTempleForm.get(field)?.disable();
  });

  
  }

  // getTempleDetails(templeId: string) {
  //   this.templeService.updatetemple(templeId).subscribe((response: any) => {
  //     const res = response[0];

  //     this.updateTempleForm.patchValue({
  //       name: res.name,
  //       temple_official_website: res.temple_official_website,
  //       temple_timings: res.temple_timings,
  //       image_location: res.image_location,
  //       status: res.status,
  //       temple_area: res.temple_area,
  //       desc: res.desc,
  //       contact_email: res.contact_email,
  //       contact_phone: res.contact_phone,
  //       contact_name: res.contact_name,
  //       address: res.address,
  //       temple_map_location: res.temple_map_location,
  //       diety: res.diety,
  //       is_navagraha_established: res.is_navagraha_established,
  //       is_destroyed: res.is_destroyed,
  //       animal_sacrifice_status: res.animal_sacrifice_status,
  //       construction_year: res.construction_year,
  //       category: res.category,
  //       priority: res.priority,
  //       style: res.style,
        
  //       country: res.object_id?.block?.district?.state?.country?.country_id || null,
  //       state: res.object_id?.block?.district?.state?.state_id || null,
  //       district: res.object_id?.block?.district?.district_id || null,
  //       block: res.object_id?.block?.block_id || null,
  //       object_id: res.object_id?._id || null
        
      
  //     });
  
  //     this.image_location = res.image_location;
  //     if (this.image_location) {
  //       this.convertToBase64(this.image_location)
  //         .then(base64 => {
  //           this.profileImage = base64;
  //           this.updateTempleForm.patchValue({
  //             image_location: base64
  //           });
  //         })
  //         .catch(error => {
  //           console.error("Error converting to base64:", error);
  //         });
  //     }
  
      
  //   });
  // }
  
  getTempleDetails(templeId: string) {
    this.templeService.updatetemple(templeId).subscribe((response: any) => {
      const res = response[0];
      
      
      this.updateTempleForm.patchValue({
        name: res.name,
        is_navagraha_established: res.is_navagraha_established,
        construction_year: res.construction_year,
        is_destroyed: res.is_destroyed,
        animal_sacrifice_status: res.animal_sacrifice_status,
        diety: res.diety,
        style: res.style,
        temple_map_location: res.temple_map_location,
        address: res.address,
        desc: res.desc,
        status: res.status,
        image_location: res.image_location,
        category: res.category,
        priority: res.priority,
        user: res.user || localStorage.getItem('user'),
        templeId: res.templeId || this.route.snapshot.paramMap.get("id"),
        temple_official_website: res.temple_official_website,
        temple_timings: res.temple_timings,
        temple_area: res.temple_area,
        contact_email: res.contact_email,
        contact_phone: res.contact_phone,
        contact_name: res.contact_name,
      });
  
      // 🌍 Store the location hierarchy
      const countryId = res.object_id?.block?.district?.state?.country?.country_id || null;
      const stateId = res.object_id?.block?.district?.state?.state_id || null;
      const districtId = res.object_id?.block?.district?.district_id || null;
      const blockId = res.object_id?.block?.block_id || null;
      const objectId = res.object_id?._id || null;
  
      // 🌐 Begin chain-loading dropdowns and patch as you go
      if (countryId) {
        this.templeService.getbyStates(countryId).subscribe((states: any) => {
          this.templeStateOptions = states.map((s: any) => ({
            label: s.name,
            value: s._id
          }));
          this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateTempleForm.patchValue({ country: countryId });
  
          if (stateId) {
            this.templeService.getdistricts(stateId).subscribe((districts: any) => {
              this.templeDistrictOptions = districts.map((d: any) => ({
                label: d.name,
                value: d._id
              }));
              this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
              this.updateTempleForm.patchValue({ state: stateId });
  
              if (districtId) {
                this.templeService.getblocks(districtId).subscribe((blocks: any) => {
                  this.templeMandalOptions = blocks.map((b: any) => ({
                    label: b.name,
                    value: b._id
                  }));
                  this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
                  this.updateTempleForm.patchValue({ district: districtId });
  
                  if (blockId) {
                    this.templeService.getvillages(blockId).subscribe((villages: any) => {
                      this.templeVillageOptions = villages.map((v: any) => ({
                        label: v.name,
                        value: v._id
                      }));
                      this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
                      this.updateTempleForm.patchValue({
                        mandal: blockId,
                        object_id: objectId
                      });
                    });
                  }
                });
              }
            });
          }
        });
      }
  
      // Handle image
      this.image_location = res.image_location;
      if (this.image_location) {
        this.convertToBase64(this.image_location)
          .then(base64 => {
            this.profileImage = base64;
            this.updateTempleForm.patchValue({
              image_location: base64
            });
          })
          .catch(error => {
            console.error("Error converting to base64:", error);
          });
      }
    });
  }
    

 profileImage: string | ArrayBuffer | null = null;
 image_location: any;

 convertToBase64(url: string): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const cleanBase64 = base64String.replace(/^data:(application\/octet-stream|image\/[a-z]+);base64,/, '');
        resolve(cleanBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}


onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64StringWithPrefix = reader.result?.toString() || '';
      const base64String = base64StringWithPrefix.split(',')[1];
      this.profileImage = base64String;
      this.updateTempleForm.patchValue({
        image_location: base64String
      });
    };
    reader.readAsDataURL(file);
  }
}


      triggerFileInput() {
        const fileInput = document.getElementById('image_location') as HTMLElement;
        fileInput.click();
      }

      onImageError(event: any) {
        event.target.src = 'assets/profile1.webp'; 
      }

  



  // onSubmit(): void {
  //   this.spinner.show();

  //   if (this.updateTempleForm.invalid) {
  //     this.updateTempleForm.markAllAsTouched();
  //     return;
  //   }
  
  //   const templeId = this.route.snapshot.paramMap.get('id');
  //   this.templeData = this.updateTempleForm.value;
  
  //   if (templeId && this.templeData) {
  //     this.templeService.updateTempleDetails(templeId, this.templeData).subscribe({
  //       next: (response) => {
  //         window.alert('✅ Temple details updated successfully!');
          
  //       },
  //       error: (error) => {
  //         window.alert('❌ Failed to update temple details. Please try again.');
  //       }
  //     });
  //   } else {
  //     window.alert('⚠️ Temple ID or form data is missing.');
  //   }
  // }
  

  onSubmit(): void {     
    this.spinner.show();
  
    if (this.updateTempleForm.invalid) {
      this.updateTempleForm.markAllAsTouched();
      this.spinner.hide(); // Hide spinner if form is invalid
      return;
    }
  
    const templeId = this.route.snapshot.paramMap.get('id');
    this.templeData = this.updateTempleForm.value;
  
    if (templeId && this.templeData) {
      this.templeService.updateTempleDetails(templeId, this.templeData).subscribe({
        next: (response) => {
          this.notificationHelper.showSuccessNotification('Temple update successfully', '');
          this.spinner.hide(); // Hide spinner on success
        },
        error: (error) => {
          this.notificationHelper.showErrorNotification('Temple update Failed');
          this.spinner.hide(); // Hide spinner on error
        }
      });
    } else {
      window.alert('⚠️ Temple ID or form data is missing.');
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