import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-temple',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-temple.component.html',
  styleUrl: './edit-temple.component.css'
})
export class EditTempleComponent {

  updateTempleForm!: FormGroup;
  templeData:any;
  userId:any;
  templeId: any;

  constructor(
    private templeService: TempleService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {


  }




  ngOnInit(): void {

    // this.getTempleDetails();
    const templeId = this.route.snapshot.paramMap.get('id');
    if (templeId) {
      this.getTempleDetails(templeId);
    }



    this.updateTempleForm = this.fb.group({
      
      name: '',
      temple_official_website: '',
      temple_timings: '',
      image_location: '',
      status: '',
      desc: '',
      contact_email: '',
      contact_phone: '',
      contact_name: '',
      address: '',
      temple_map_location: '',
      diety: '',
      is_navagraha_established: '',
      is_destroyed: '',
      created_at: '',
      animal_sacrifice_status: '',
      construction_year: '',
      
    
  })
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
      construction_year: response.construction_year
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
}
