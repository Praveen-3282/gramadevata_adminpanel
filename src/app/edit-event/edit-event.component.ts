import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../services/event.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-edit-event',
  imports: [ReactiveFormsModule, CommonModule,NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

      updateEventForm!: FormGroup;
      village_id: any;
      eventCountryOptions: any[] = [];
      eventStateOptions: any[] = [];
      eventDistrictOptions: any[] = [];
      eventMandalOptions: any[] = [];
      eventVillageOptions: any[] = [];
      eventCategoryoptions:any[]=[];
      InVillage = false;
      minDate: string ="";
      bannerFileList: NzUploadFile[] = [];
      countryID:any[]=[];
      formGroup: any;
      userId:any;



    constructor( private fb: FormBuilder, private templeService: TempleService, private eventService: EventService, private route: ActivatedRoute,
    ){}

  ngOnInit(){

    const eventId = this.route.snapshot.paramMap.get('id');
    if(eventId){
      this.getEventDetails(eventId);
      this.fetchallaCategories()
    }

    this.updateEventForm = this.fb.group({
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date:['', Validators.required],
      start_time: [''],
      end_time:[''],
      contact_name: ['',Validators.required],
      contact_phone: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      contact_email: [''],
      desc: [''],
      address: ['', Validators.required],
      image_location: ['',Validators.required],
      category: ['', Validators.required],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      mandal: [{ value: '', disabled: true }, [Validators.required]],
      object_id: [{ value: '', disabled: true }, [Validators.required]],
      user:localStorage.getItem('user'),
      status: ['INACTIVE'],
      map_location:['', Validators.required],
      
  });


  if (this.village_id != null) {
    
    this.updateEventForm.get('object_id')?.enable();

    
    try {
      this.updateEventForm.get('object_id')?.setValue(this.village_id);
      console.log(this.updateEventForm.get('object_id')?.value, "Updated object_id value");
    } catch (error) {
      console.error("Error setting object_id:", error);
    }

   
    this.updateEventForm.get('country')?.clearValidators();
    this.updateEventForm.get('state')?.clearValidators();
    this.updateEventForm.get('district')?.clearValidators();
    this.updateEventForm.get('mandal')?.clearValidators();
  } else {
   
    this.updateEventForm.get('object_id')?.disable();
    this.updateEventForm.get('country')?.setValidators(Validators.required);
    this.updateEventForm.get('state')?.setValidators(Validators.required);
    this.updateEventForm.get('district')?.setValidators(Validators.required);
    this.updateEventForm.get('mandal')?.setValidators(Validators.required);
  }

  this.updateEventForm.get('country')?.updateValueAndValidity();
  this.updateEventForm.get('state')?.updateValueAndValidity();
  this.updateEventForm.get('district')?.updateValueAndValidity();
  this.updateEventForm.get('mandal')?.updateValueAndValidity();
  this.updateEventForm.get('object_id')?.updateValueAndValidity();

  this.templeService.GetAllCountries().subscribe(
    (res) => {
      this.eventCountryOptions = res.map((country: any) => ({
        label: country.name,
        value: country._id,
      }));
      this.eventCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

      const defaultCountry = this.eventCountryOptions.find(option => option.label === 'India');
      if (defaultCountry) {
        this.updateEventForm.controls['country'].setValue(defaultCountry.value);
      }
    },
    (err) => {
      console.log(err);
    }
  );


  this.updateEventForm.get('country')?.valueChanges.subscribe(countryId => {
    this.resetFormFields(['state', 'district', 'mandal', 'object_id']);
    if (countryId) {
      this.templeService.getbyStates(countryId).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.eventStateOptions = res.map((state: any) => ({
              label: state.name,
              value: state._id,
            }));
            this.eventStateOptions.sort((a, b) => a.label.localeCompare(b.label));
          } else {
            console.error('Response is not an array:', res);
          }
        },
        (err) => console.log(err)
      );
      this.updateEventForm.get('state')?.enable();
    }
  });

  this.updateEventForm.get('state')?.valueChanges.subscribe(stateId => {
    this.resetFormFields(['district', 'mandal', 'object_id']);
    if (stateId) {
      this.templeService.getdistricts(stateId).subscribe(
        (res) => {
          this.eventDistrictOptions = res.map((district: any) => ({
            label: district.name,
            value: district._id,
          }));
          this.eventDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
        },
        (err) => console.log(err)
      );
      this.updateEventForm.get('district')?.enable();
    }
  });

  this.updateEventForm.get('district')?.valueChanges.subscribe(districtId => {
    this.resetFormFields(['mandal', 'object_id']);
    if (districtId) {
      
      this.templeService.getblocks(districtId).subscribe(
        (res) => {
          this.eventMandalOptions = res.map((mandal: any) => ({
            label: mandal.name,
            value: mandal._id,
          }));
          this.eventMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
        },
        (err) => console.log(err)
      );
      this.updateEventForm.get('mandal')?.enable();
    }
  });

  this.updateEventForm.get('mandal')?.valueChanges.subscribe(mandalId => {
    this.updateEventForm.get('object_id')?.reset();
    this.updateEventForm.get('object_id')?.disable();
    if (mandalId) {
      this.templeService.getvillages(mandalId).subscribe(
        (res) => {
          this.eventVillageOptions = res.map((village: any) => ({
            label: village.name,
            value: village._id,
          }));
          this.eventVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateEventForm.get('object_id')?.enable();
        },
        (err) => console.log(err)
      );
    }
  });

  

 }





 private resetFormFields(fields: string[]) {
  fields.forEach(field => {
    this.updateEventForm.get(field)?.reset();
    this.updateEventForm.get(field)?.disable();
  });

  }

// getEventDetails(eventId: string) {
//   this.eventService.updateevent(eventId).subscribe((response: any) => {
//     const res = response[0];

//     // Update the form values without reinitializing the form group
//     this.updateEventForm.patchValue({
//       name: res.name,
//       start_date: res.start_date,
//       end_date: res.end_date,
//       start_time: res.start_time,
//       end_time: res.end_time,
//       image_location: res.image_location,
//       status: res.status,
//       desc: res.desc,
//       contact_email: res.contact_email,
//       contact_phone: res.contact_phone,
//       contact_name: res.contact_name,
//       address: res.address,
//       category: res.category,
//       map_location: res.map_location,
//       style: res.style,
//       priority: res.priority,

//       country: res.country || '',  
//       state: res.state || '',
//       district: res.district || '',
//       mandal: res.mandal || '',
//       object_id: res.object_id || ''
//     });

//     // Handle the image conversion
//     this.image_location = res.image_location;
//     if (this.image_location) {
//       this.convertToBase64(this.image_location)
//         .then(base64 => {
//           this.profileImage = base64;
//           this.updateEventForm.patchValue({
//             image_location: base64
//           });
//         })
//         .catch(error => {
//           console.error("Error converting to base64:", error);
//         });
//     }

//   }, (err) => {
//     console.log(err);
//   });
// }



getEventDetails(eventId: string) {
  this.eventService.updateevent(eventId).subscribe((response: any) => {
    const res = response[0];

    // Patch basic event fields
    this.updateEventForm.patchValue({
      name: res.name,
      start_date: res.start_date,
      end_date: res.end_date,
      start_time: res.start_time,
      end_time: res.end_time,
      image_location: res.image_location,
      status: res.status,
      desc: res.desc,
      contact_email: res.contact_email,
      contact_phone: res.contact_phone,
      contact_name: res.contact_name,
      address: res.address,
      category: res.category,
      map_location: res.map_location,
      style: res.style,
      priority: res.priority,
      object_id: res.object_id || ''
    });

    // 🌍 Extract location hierarchy
    const countryId = res.object_id?.block?.district?.state?.country?.country_id || null;
      const stateId = res.object_id?.block?.district?.state?.state_id || null;
      const districtId = res.object_id?.block?.district?.district_id || null;
      const blockId = res.object_id?.block?.block_id || null;
      const objectId = res.object_id?._id || null;

    // 🌐 Begin chain-loading dropdowns and patching values
    if (countryId) {
      this.templeService.getbyStates(countryId).subscribe((states: any) => {
        this.eventStateOptions = states.map((s: any) => ({
          label: s.name,
          value: s._id
        }));
        this.eventStateOptions.sort((a, b) => a.label.localeCompare(b.label));
        this.updateEventForm.patchValue({ country: countryId });

        if (stateId) {
          this.templeService.getdistricts(stateId).subscribe((districts: any) => {
            this.eventDistrictOptions = districts.map((d: any) => ({
              label: d.name,
              value: d._id
            }));
            this.eventDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.updateEventForm.patchValue({ state: stateId });

            if (districtId) {
              this.templeService.getblocks(districtId).subscribe((mandals: any) => {
                this.eventMandalOptions = mandals.map((m: any) => ({
                  label: m.name,
                  value: m._id
                }));
                this.eventMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
                this.updateEventForm.patchValue({
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
          this.updateEventForm.patchValue({
            image_location: base64
          });
        })
        .catch(error => {
          console.error("Error converting to base64:", error);
        });
    }

  }, (err) => {
    console.error(err);
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
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateEventForm.patchValue({
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

  

  

   updateMinDate() {
    const startDate = this.updateEventForm.get('start_date')?.value;
    this.minDate = startDate ? startDate : ''; // Set the min date for end_date
  }

  handleBannerFileRemove(): void {
    // Clear the file list and reset the form control value
    this.bannerFileList = [];
    this.updateEventForm.get('image_location')?.reset();
    this.updateEventForm.get('image_location')?.markAsTouched(); // To show validation error immediately
  }


  
  handleBannerFileChange(info: NzUploadChangeParam): void {
    const fileList = [...info.fileList];
  
    if (info.file.status === 'removed') {
      // If the file is removed, clear the form control
      this.handleBannerFileRemove();
    } else {
      // Handle file upload
      fileList.forEach((file: NzUploadFile) => {
        this.getBase64(file.originFileObj!, (base64String: string) => {
          file['base64'] = base64String;
          this.updateEventForm.patchValue({ image_location: base64String });
        });
      });
  
      this.updateEventForm.get('image_location')?.setValue(fileList);
      this.bannerFileList = fileList;
    }
  
    console.log('image submit', this.updateEventForm.value);
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


  fetchallaCategories():void{
    this.eventService.getEventCategory().subscribe(
      (res) => {
        res.forEach((category:any) =>{
          this.eventCategoryoptions.push({
            label:category.name,
            value:category._id
          })
        })
      },
      (err) => {
        console.log(err)
      }
    )
  }

  triggerFileInput() {
    const fileInput = document.getElementById('image_location') as HTMLElement;
    fileInput.click();
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
        this.updateEventForm.patchValue({
          image_location: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/profile1.webp'; 
  }


  get contactNumber() {
    return this.updateEventForm.get('contact_phone');
  }

  onSubmit(): void {
    console.log('Submit button clicked');
    if (this.updateEventForm.invalid) {
      console.warn('Form is invalid', this.updateEventForm.errors);
      this.updateEventForm.markAllAsTouched(); // highlight errors
      return;
    }
  
    const eventId = this.route.snapshot.paramMap.get('id');
    console.log('Goshala ID:', eventId);
  
    const formValue = this.updateEventForm.getRawValue(); // Get values including disabled fields
  
    if (eventId && formValue) {
      this.eventService.updateEventDetails(eventId, formValue).subscribe({
        next: (response) => {
          console.log('Temple updated successfully!', response);
          window.alert('✅ Event details updated successfully!');
        },
        error: (error) => {
          console.error('Error updating temple', error);
          window.alert('❌ Failed to update event details. Please try again.');
        }
      });
    } else {
      console.warn('Temple ID or data is missing');
      window.alert('⚠️ Event ID or form data is missing.');
    }
  }

}
