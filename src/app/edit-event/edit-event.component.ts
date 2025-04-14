import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { TempleService } from '../services/temple.service';



@Component({
  selector: 'app-edit-event',
  imports: [NzUploadModule,],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {

  updateEventForm!: FormGroup;
  village_id: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions: any[] = [];





 


 constructor( private fb: FormBuilder, private templeService: TempleService){

 }

 ngOnInit(){


  this.updateEventForm = this.fb.group({
    name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date:['', Validators.required],
      start_time: [''],
      end_time:[''],
      // tag: [''],
      // tag_id: [null],
      // tag_type_id: [null],
      // // geo_site: [''],
      // content_type_id: [null],
      // map_location: [''],
      contact_name: ['',Validators.required],
      contact_phone: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      contact_email: [''],
      desc: [''],
      // status: [''],
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
      map_location:['', Validators.required]
  });


  if (this.village_id != null) {
    // Enable object_id before setting its value
    this.updateEventForm.get('object_id')?.enable();

    // Strictly set the value using setValue
    try {
      this.updateEventForm.get('object_id')?.setValue(this.village_id);
      console.log(this.updateEventForm.get('object_id')?.value, "Updated object_id value");
    } catch (error) {
      console.error("Error setting object_id:", error);
    }

    // Clear validators for location fields
    this.updateEventForm.get('country')?.clearValidators();
    this.updateEventForm.get('state')?.clearValidators();
    this.updateEventForm.get('district')?.clearValidators();
    this.updateEventForm.get('mandal')?.clearValidators();
  } else {
    // When village_id is null, disable object_id and require location fields
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
      this.templeCountryOptions = res.map((country: any) => ({
        label: country.name,
        value: country._id,
      }));
      this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

      const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
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
      this.updateEventForm.get('state')?.enable();
    }
  });

  this.updateEventForm.get('state')?.valueChanges.subscribe(stateId => {
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
      this.updateEventForm.get('district')?.enable();
    }
  });

  this.updateEventForm.get('district')?.valueChanges.subscribe(districtId => {
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
      this.updateEventForm.get('mandal')?.enable();
    }
  });

  this.updateEventForm.get('mandal')?.valueChanges.subscribe(mandalId => {
    this.updateEventForm.get('object_id')?.reset();
    this.updateEventForm.get('object_id')?.disable();
    if (mandalId) {
      this.templeService.getvillages(mandalId).subscribe(
        (res) => {
          this.templeVillageOptions = res.map((village: any) => ({
            label: village.name,
            value: village._id,
          }));
          this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
          this.updateEventForm.get('object_id')?.enable();
        },
        (err) => console.log(err)
      );
    }
  });

 }
}
