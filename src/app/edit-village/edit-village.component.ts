import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TempleService } from '../services/temple.service';
import { VillagesService } from '../services/villages.service';

@Component({
  selector: 'app-edit-village',
  imports: [ReactiveFormsModule, CommonModule,NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule],
  templateUrl: './edit-village.component.html',
  styleUrl: './edit-village.component.css'
})
export class EditVillageComponent {
  updateVillageForm! : FormGroup;
  village_id: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions: any[] = [];
  villageData: any;




  constructor( private route: ActivatedRoute, 
               private formBuilder: FormBuilder,
               private templeService: TempleService,
               private fb: FormBuilder,
               private villageservice: VillagesService,

  ){

  }

  ngOnInit(): void {  
 


    const villageId = this.route.snapshot.paramMap.get('id');
    console.log('Village ID:', villageId);
  
    if (villageId) {
      this.getVillageDetails(villageId);
    } else {
      console.warn('Village ID not found in route');
    }

    this.updateVillageForm = this.fb.group({
      
      name: ['', Validators.required],
      pin_code: ['', Validators.required],
      desc: [''],
      status: [''],
      image_location: ['', Validators.required],
      type: ['VILLAGE'],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      block: [{ value: '', disabled: true }, [Validators.required]],
      villageId : this.route.snapshot.paramMap.get('id'),
      user: localStorage.getItem('user'),


    
    })

      if (this.village_id != null) {
        this.updateVillageForm.get('object_id')?.enable();

        try {
          this.updateVillageForm.get('object_id')?.setValue(this.village_id);
          console.log(this.updateVillageForm.get('object_id')?.value, "Updated object_id value");
        } catch (error) {
          console.error("Error setting object_id:", error);
        }

        this.updateVillageForm.get('country')?.clearValidators();
        this.updateVillageForm.get('state')?.clearValidators();
        this.updateVillageForm.get('district')?.clearValidators();
        this.updateVillageForm.get('block')?.clearValidators();
      } else {
        // When village_id is null, disable object_id and require location fields
        this.updateVillageForm.get('object_id')?.disable();
        this.updateVillageForm.get('country')?.setValidators(Validators.required);
        this.updateVillageForm.get('state')?.setValidators(Validators.required);
        this.updateVillageForm.get('district')?.setValidators(Validators.required);
        this.updateVillageForm.get('block')?.setValidators(Validators.required);
      }

      // Update validation status after changing validators
      this.updateVillageForm.get('country')?.updateValueAndValidity();
      this.updateVillageForm.get('state')?.updateValueAndValidity();
      this.updateVillageForm.get('district')?.updateValueAndValidity();
      this.updateVillageForm.get('block')?.updateValueAndValidity();
      this.updateVillageForm.get('object_id')?.updateValueAndValidity();

  

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
          this.updateVillageForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );

  // Listen for changes in the country dropdown and update states accordingly
  this.updateVillageForm.get('country')?.valueChanges.subscribe(countryId => {
    this.resetFormFields(['state', 'district', 'block', 'object_id']);
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
      this.updateVillageForm.get('state')?.enable();
    }
  });
  // Listen for changes in the state dropdown and update districts accordingly
  this.updateVillageForm.get('state')?.valueChanges.subscribe(stateId => {
    this.resetFormFields(['district', 'block', 'object_id']);
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
      this.updateVillageForm.get('district')?.enable();
    }
  });

  // Listen for changes in the district dropdown and update mandals accordingly
  this.updateVillageForm.get('district')?.valueChanges.subscribe(districtId => {
    this.resetFormFields(['block', 'object_id']);
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
      this.updateVillageForm.get('block')?.enable();
    }
  });

  // Listen for changes in the mandal dropdown and update villages accordingly
  this.updateVillageForm.get('block')?.valueChanges.subscribe(mandalId => {
    this.updateVillageForm.get('object_id')?.reset();
    this.updateVillageForm.get('object_id')?.disable();
    if (mandalId) {
      this.templeService.getvillages(mandalId).subscribe(
        (res) => {
          this.templeVillageOptions = res.map((village: any) => ({
            label: village.name,
            value: village._id,
          }));
          this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateVillageForm.get('object_id')?.enable();
        },
        (err) => console.log(err)
      );
    }
  });
}   

    private resetFormFields(fields: string[]) {
      fields.forEach(field => {
        this.updateVillageForm.get(field)?.reset();
        this.updateVillageForm.get(field)?.disable();
      });

      }

      onSubmit(): void {
        if (this.updateVillageForm.invalid) {
          this.updateVillageForm.markAllAsTouched();
          console.warn('Form is invalid');
          return;
        }
      
        const villageId = this.route.snapshot.paramMap.get('id');
        this.villageData = this.updateVillageForm.value;
      
        console.log('Form Data:', this.villageData);
        console.log('Village ID:', villageId);
      
        if (villageId && this.villageData) {
          this.villageservice.updateTempleDetails(villageId, this.villageData).subscribe({
            next: (response) => {
              console.log('Update successful:', response);
              window.alert('✅ Temple details updated successfully!');
            },
            error: (error) => {
              console.error('Update failed:', error);
              window.alert('❌ Failed to update temple details. Please try again.');
              
            }
          });
        } else {
          console.warn('Missing village ID or form data');
        }
      }
      

  
    getVillageDetails(village_id: string){
      this.villageservice.getvillage(village_id).subscribe({
        next: (response: any) => {
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',village_id)
          const res = response[0];
          this.updateVillageForm.patchValue({
            pin_code: res.pin_code,
            image_location: res.image_location,
            desc: res.desc,
            name: res.name,
            type: res.type,
            country: res.block?.district?.state?.country?.countryid|| null,
            state: res.block?.district?.state?.stateid || null,
            district: res.block?.district?.districtid || null,
            block: res.block?.id || null,
          });

          this.image_location = res.image_location;
      if (this.image_location) {
        this.convertToBase64(this.image_location)
          .then(base64 => {
            this.profileImage = base64;
            this.updateVillageForm.patchValue({
              image_location: base64
            });
          })
          .catch(error => {
            console.error("Error converting to base64:", error);
          });
      }

       
        },
        error: (error) => {
          console.error('Error fetching village:', error);
        }
      });
      
    }

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

  profileImage: string | ArrayBuffer | null = null;
  image_location: any;
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64StringWithPrefix = reader.result?.toString() || '';
        const base64String = base64StringWithPrefix.split(',')[1];
        this.profileImage = base64String;
        this.updateVillageForm.patchValue({
          image_location: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }
  onImageError(event: any) {
    event.target.src = 'assets/profile1.webp'; 
  }
  triggerFileInput() {
    const fileInput = document.getElementById('image_location') as HTMLElement;
    fileInput.click();
  }


}
