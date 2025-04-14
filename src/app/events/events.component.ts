import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  fetchallevents: any;
  events: any;
  constructor( private eventservice: EventService){}

  ngOnInit(): void {
    this.eventservice.GetallEvents().subscribe(
      (data) => {
        console.log("Events fetched:", data);
        this.events = data; // now you can use this in your HTML template
      },
      (error) => {
        console.error("Error fetching events:", error);
      }
    );
  }
}
