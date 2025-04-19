import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthenticationService } from '../services/authentication.service';
import { GoshalaService } from '../services/goshala.service';

@Component({
  selector: 'app-goshalas',
  imports: [CommonModule, NzSelectModule],
  templateUrl: './goshalas.component.html',
  styleUrl: './goshalas.component.css'
})
export class GoshalasComponent {
//   goshalas: any;
//   selectedGoshala: any = null
//   constructor( private goshalaService: GoshalaService,
//                private router: Router
//   ){}

//   ngOnInit(){ 
//     this.loadGoshalas();
//   }

//   loadGoshalas(): void {
//     this.goshalaService.GetallGoshala().subscribe(
//       (data) => {
//         this.goshalas = data;
//       },
//       (error) => {
//         console.error('Error fetching goshalas:', error);
//       }
//     );
//   }

//   navigateToGoshala(goshalaId: string): void {
//     this.selectedGoshala= goshalaId;
    
//     this.router.navigate(['goshala', goshalaId]);  // Adjust route path as needed
//   }
  
//   handleImageError(event: Event) {
//     const img = event.target as HTMLImageElement;
//     img.src = 'assets/gaumata.jpg'; // fallback image
//   }
// }
 temples: any;
  selectedTemple: any = null;
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
  goshaladata:any;

  constructor(private templeservice: TempleService, private router: Router, private authenticationservice: AuthenticationService,
    private goshalaService: GoshalaService,
    private route:ActivatedRoute,
  ){}

  ngOnInit(): void{
    this.fetchagoshals();
// this.fetchgoshalagetbyid();
    this.getAllCategories();
  }

  


  fetchagoshals(): void {
    this.goshalaService.getallgoshalas().subscribe({
      next: (data: any[]) => {
        this.temples = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        console.log('All temples (sorted):', this.temples);
      },
      error: (error: any) => {
        console.error('Error fetching temples:', error);
      }
    });
  }
  
  
 


  fetchgoshalagetbyid(temple:any): void {
    this.templeId = this.route.snapshot.paramMap.get("id");
    this.selectedTemple = temple;

  
    this.goshalaService.getbyGoshala(this.templeId).subscribe(
      (data: any) => {
        this.goshaladata = data;
      },
      (error: any) => {
        console.error('Error fetching goshala data:', error);
      }
    );
  }
  


  


  editGoshala(id: any): void {
    this.router.navigate(['editgoshala', id]);
  }
  
  

  handleImageError(event: Event){
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  getAllCategories(): void {
    this.goshalaService.getGoshalaCatgeories().subscribe(
      (data: any) => {
        this.CategoryOptions = data;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  
  
}
