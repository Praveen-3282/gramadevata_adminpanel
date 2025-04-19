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




  constructor( private route: ActivatedRoute, 
               private formBuilder: FormBuilder,
               private templeService: TempleService,
               private fb: FormBuilder,

  ){

  }

  ngOnInit(): void {  
   


    
    const goshalaId = this.route.snapshot.paramMap.get('id');
    if (goshalaId) {
      // this.getGoshalaDetails(goshalaId);
    }
    this.updateVillageForm = this.fb.group({
      
      name: ['', Validators.required],
      pin_code: ['', Validators.required],
      desc: [''],
      status: ['INACTIVE'],
      image_location: ['', Validators.required],
      type: ['VILLAGE'],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      block: [{ value: '', disabled: true }, [Validators.required]],

    
    })

      if (this.village_id != null) {
        // Enable object_id before setting its value
        this.updateVillageForm.get('object_id')?.enable();

        // Strictly set the value using setValue
        try {
          this.updateVillageForm.get('object_id')?.setValue(this.village_id);
          console.log(this.updateVillageForm.get('object_id')?.value, "Updated object_id value");
        } catch (error) {
          console.error("Error setting object_id:", error);
        }

        // Clear validators for location fields
        this.updateVillageForm.get('country')?.clearValidators();
        this.updateVillageForm.get('state')?.clearValidators();
        this.updateVillageForm.get('district')?.clearValidators();
        this.updateVillageForm.get('mandal')?.clearValidators();
      } else {
        // When village_id is null, disable object_id and require location fields
        this.updateVillageForm.get('object_id')?.disable();
        this.updateVillageForm.get('country')?.setValidators(Validators.required);
        this.updateVillageForm.get('state')?.setValidators(Validators.required);
        this.updateVillageForm.get('district')?.setValidators(Validators.required);
        this.updateVillageForm.get('mandal')?.setValidators(Validators.required);
      }

      // Update validation status after changing validators
      this.updateVillageForm.get('country')?.updateValueAndValidity();
      this.updateVillageForm.get('state')?.updateValueAndValidity();
      this.updateVillageForm.get('district')?.updateValueAndValidity();
      this.updateVillageForm.get('mandal')?.updateValueAndValidity();
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
      this.updateVillageForm.get('state')?.enable();
    }
  });

  // Listen for changes in the state dropdown and update districts accordingly
  this.updateVillageForm.get('state')?.valueChanges.subscribe(stateId => {
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
      this.updateVillageForm.get('district')?.enable();
    }
  });

  // Listen for changes in the district dropdown and update mandals accordingly
  this.updateVillageForm.get('district')?.valueChanges.subscribe(districtId => {
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
      this.updateVillageForm.get('mandal')?.enable();
    }
  });

  // Listen for changes in the mandal dropdown and update villages accordingly
  this.updateVillageForm.get('mandal')?.valueChanges.subscribe(mandalId => {
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
}
