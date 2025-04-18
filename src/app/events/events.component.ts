import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  fetchallevents: any;
  events: any;
  upcomingevents: any;
  selectedEvent: any = null;
  constructor( private eventservice: EventService, private router: Router){}

  ngOnInit(): void {
    this.getinactivevents();
    this.getinactivevents1()
  }

      getinactivevents(){
      this.eventservice.GetallinactiveEvents().subscribe(
        (data) => {

          console.log("Events fetched:", data);
          
          this.events = data.event_completed;
        },
        (error) => {
          console.error("Error fetching events:", error);
        }
      );
      }

      getinactivevents1(){
        this.eventservice.GetallinactiveEvents().subscribe(
          (data) => {
      
            console.log("Events fetched:", data);
            this.upcomingevents = data.event_upcoming; // now you can use this in your HTML template
            
          },
          (error) => {
            console.error("Error fetching events:", error);
          }
        );
      }

      onEventClick(event: any) {
        
        this.selectedEvent = event;
      }

      navigateeditevent( _id: string){
        this.router.navigate(['edit_event',_id])
      }

}
