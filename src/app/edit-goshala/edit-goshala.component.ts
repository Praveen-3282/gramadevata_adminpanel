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
import { GoshalaService } from '../services/goshala.service';
@Component({
  selector: 'app-edit-goshala',
  imports: [ReactiveFormsModule, CommonModule,NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule],
  templateUrl: './edit-goshala.component.html',
  styleUrl: './edit-goshala.component.css'
})
export class EditGoshalaComponent {
  updateGoshalaForm!: FormGroup;
  goshalaData:any;
  userId:any;
  goshalaId: any;
  bannerFileList: NzUploadFile[] = [];
  templeVillageOptions: any[] = [];
  village_id: any;
  templeCategoryOptions: any[] = [];
  templePriorityOptions: any[] = [];
  goshalaStyleOptions: any[] = [];
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
    private goshalaService:GoshalaService

  ) {


  }




  ngOnInit(): void {  
    this.fetchAllPriority();
    this.fetchallCategorys();


    
    const goshalaId = this.route.snapshot.paramMap.get('id');
    if (goshalaId) {
      this.getGoshalaDetails(goshalaId);
    }
    this.updateGoshalaForm = this.fb.group({
      
      name:['',Validators.required],
      reg_num:[''],
      category: ['', [Validators.required]],
      contact_name:['', [Validators.required]],
      contact_phone: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      desc:[''],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      mandal: [{ value: '', disabled: true }, [Validators.required]],
      object_id: [{ value: '', disabled: true }, [Validators.required]],
      temple: null,
      image_location:[' '],
      address:['',Validators.required],
      user:localStorage.getItem('user'),
      status: ['INACTIVE'],
      map_location: ['', Validators.required],
      goshalaId: this.route.snapshot.paramMap.get("id"),

    
    })

      if (this.village_id != null) {
        
        this.updateGoshalaForm.get('object_id')?.enable();

        
        try {
          this.updateGoshalaForm.get('object_id')?.setValue(this.village_id);
          console.log(this.updateGoshalaForm.get('object_id')?.value, "Updated object_id value");
        } catch (error) {
          console.error("Error setting object_id:", error);
        }

        // Clear validators for location fields
        this.updateGoshalaForm.get('country')?.clearValidators();
        this.updateGoshalaForm.get('state')?.clearValidators();
        this.updateGoshalaForm.get('district')?.clearValidators();
        this.updateGoshalaForm.get('mandal')?.clearValidators();
      } else {
        // When village_id is null, disable object_id and require location fields
        this.updateGoshalaForm.get('object_id')?.disable();
        this.updateGoshalaForm.get('country')?.setValidators(Validators.required);
        this.updateGoshalaForm.get('state')?.setValidators(Validators.required);
        this.updateGoshalaForm.get('district')?.setValidators(Validators.required);
        this.updateGoshalaForm.get('mandal')?.setValidators(Validators.required);
      }

      // Update validation status after changing validators
      this.updateGoshalaForm.get('country')?.updateValueAndValidity();
      this.updateGoshalaForm.get('state')?.updateValueAndValidity();
      this.updateGoshalaForm.get('district')?.updateValueAndValidity();
      this.updateGoshalaForm.get('mandal')?.updateValueAndValidity();
      this.updateGoshalaForm.get('object_id')?.updateValueAndValidity();

  

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
        this.updateGoshalaForm.controls['country'].setValue(defaultCountry.value);
      }
    },
    (err) => {
      console.log(err);
    }
  );

  // Listen for changes in the country dropdown and update states accordingly
  this.updateGoshalaForm.get('country')?.valueChanges.subscribe(countryId => {
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
      this.updateGoshalaForm.get('state')?.enable();
    }
  });

  // Listen for changes in the state dropdown and update districts accordingly
  this.updateGoshalaForm.get('state')?.valueChanges.subscribe(stateId => {
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
      this.updateGoshalaForm.get('district')?.enable();
    }
  });

  // Listen for changes in the district dropdown and update mandals accordingly
  this.updateGoshalaForm.get('district')?.valueChanges.subscribe(districtId => {
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
      this.updateGoshalaForm.get('mandal')?.enable();
    }
  });

  // Listen for changes in the mandal dropdown and update villages accordingly
  this.updateGoshalaForm.get('mandal')?.valueChanges.subscribe(mandalId => {
    this.updateGoshalaForm.get('object_id')?.reset();
    this.updateGoshalaForm.get('object_id')?.disable();
    if (mandalId) {
      this.templeService.getvillages(mandalId).subscribe(
        (res) => {
          this.templeVillageOptions = res.map((village: any) => ({
            label: village.name,
            value: village._id,
          }));
          this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateGoshalaForm.get('object_id')?.enable();
        },
        (err) => console.log(err)
      );
    }
  });

  
}
private resetFormFields(fields: string[]) {
  fields.forEach(field => {
    this.updateGoshalaForm.get(field)?.reset();
    this.updateGoshalaForm.get(field)?.disable();
  });

  }

  // getGoshalaDetails(goshala:string) {

  //   this.goshalaService.Editbygoshalagetresponse(goshala).subscribe((response:any) => {
  //    this. updateGoshalaForm .patchValue({
  //     name: response.name,
      
  //     image_location:response.image_location,
  //     status: response.status,
  //     desc: response.desc,

  //     contact_phone:response.contact_phone,
  //     contact_name:response.contact_name,
  //     address: response.address,
  //     map_location:response.map_location,

  //     category:response.category,
  //     object_id:response.object_id,
  //     mandal:response.mandal,
  //     district:response.district,
  //     state:response.state,
  //     country:response.country, 
  //     reg_num: response.reg_num,
      

  //    }) ;

  //    this.image_location = response.image_location;
  //    if (this.image_location) {
  //      this.convertToBase64(this.image_location)
  //        .then(base64 => {
  //          this.profileImage = base64;
  //          this.updateGoshalaForm.patchValue({
  //            image_location: base64
  //          });
  //        })
  //        .catch(error => {
  //          console.error("Error converting to base64:", error);
  //        });
  //    }
  //   });
  // }



  getGoshalaDetails(goshalaId: string) {
    this.goshalaService.Editbygoshalagetresponse(goshalaId).subscribe((response: any) => {
      const res = response;
  
      // Patch basic goshala fields
      this.updateGoshalaForm.patchValue({
        name: res.name,
        image_location: res.image_location,
        status: res.status,
        desc: res.desc,
        contact_phone: res.contact_phone,
        contact_name: res.contact_name,
        address: res.address,
        map_location: res.map_location,
        category: res.category,
        reg_num: res.reg_num,
        object_id: res.object_id?._id || null,
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
          this.updateGoshalaForm.patchValue({ country: countryId });
  
          if (stateId) {
            this.templeService.getdistricts(stateId).subscribe((districts: any) => {
              this.templeDistrictOptions = districts.map((d: any) => ({
                label: d.name,
                value: d._id
              }));
              this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
              this.updateGoshalaForm.patchValue({ state: stateId });
  
              if (districtId) {
                this.templeService.getblocks(districtId).subscribe((mandals: any) => {
                  this.templeMandalOptions = mandals.map((m: any) => ({
                    label: m.name,
                    value: m._id
                  }));
                  this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
                  this.updateGoshalaForm.patchValue({
                    district: districtId,
                    mandal: blockId,
                    object_id: objectId
                  });
                });
              }
            });
          }
        });
      }
  
      // 📷 Convert and patch image
      this.image_location = res.image_location;
      if (this.image_location) {
        this.convertToBase64(this.image_location)
          .then(base64 => {
            this.profileImage = base64;
            this.updateGoshalaForm.patchValue({
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
        this.updateGoshalaForm.patchValue({
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
  //   console.log('Submit button clicked');
  //   const goshalaId = this.route.snapshot.paramMap.get('id');
  //   console.log('Goshala ID:', goshalaId);

  //   if (goshalaId && this.goshalaData) {
  //     this.goshalaService.updateGoshalaDetails(goshalaId, this.goshalaData).subscribe({
  //       next: (response) => {
  //         console.log('Temple updated successfully!', response);
  //       },
  //       error: (error) => {
  //         console.error('Error updating temple', error);
  //       }
  //     });
  //   } else {
  //     console.warn('Temple ID or data is missing');
  //   }
  // }


  onSubmit(): void {
    console.log('Submit button clicked');
    if (this.updateGoshalaForm.invalid) {
      console.warn('Form is invalid', this.updateGoshalaForm.errors);
      this.updateGoshalaForm.markAllAsTouched(); // highlight errors
      return;
    }
  
    const goshalaId = this.route.snapshot.paramMap.get('id');
    console.log('Goshala ID:', goshalaId);
  
    const formValue = this.updateGoshalaForm.getRawValue(); // Get values including disabled fields
  
    if (goshalaId && formValue) {
      this.goshalaService.updateGoshalaDetails(goshalaId, formValue).subscribe({
        next: (response) => {
          console.log('Goshala updated successfully!', response);
          window.alert('✅ Goshala details updated successfully!');
        },
        error: (error) => {
          console.error('Error updating temple', error);
          window.alert('❌ Failed to update Goshala details. Please try again.');
        }
      });
    } else {
      console.warn('Goshala ID or data is missing');
      window.alert('⚠️ Goshala ID or form data is missing.');
    }
  }
  
  

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateGoshalaForm.patchValue({
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
          this.updateGoshalaForm.patchValue({ image_location: base64Images });
          console.log('Updated images form:', this.updateGoshalaForm.value);
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
    this.goshalaService.getGoshalaCatgeories().subscribe(
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

 

  // get deityList(): FormArray {
  //   return this.updateGoshalaForm.get('deityList') as FormArray;
  // }

  get contactNumber() {
    return this.updateGoshalaForm.get('contact_phone');
  }
}