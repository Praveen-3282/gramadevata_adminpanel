import { Component } from '@angular/core';
import { TempleService } from '../services/temple.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temples',
  imports: [CommonModule],
  templateUrl: './temples.component.html',
  styleUrl: './temples.component.css'
  
})
export class TemplesComponent {
  temples: any;
  selectedTemple: any = null;
  constructor(private templeservice: TempleService){}

  ngOnInit(): void{
    this.fetchTemples();
  }

  fetchTemples(): void {
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
  }
}
