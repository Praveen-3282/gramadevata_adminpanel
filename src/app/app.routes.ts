import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { TemplesComponent } from './temples/temples.component';
import { EventsComponent } from './events/events.component';
import { GoshalasComponent } from './goshalas/goshalas.component';
import { EditTempleComponent } from './edit-temple/edit-temple.component';
import { EditGoshalaComponent } from './edit-goshala/edit-goshala.component';
import { VillagesComponent } from './villages/villages.component';
import { EditVillageComponent } from './edit-village/edit-village.component';
import { EditEventComponent } from './edit-event/edit-event.component';
// import { EditEventComponent } from './edit-event/edit-event.component';

export const routes: Routes = [
    {path: '', redirectTo: 'temples', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'header', component: HeaderComponent},
    {path: 'temples', component: TemplesComponent},
    {path: 'events', component: EventsComponent},
    {path: 'goshalas', component: GoshalasComponent},
    {path: 'edit_temple/:id', component: EditTempleComponent},
    // { path: 'edit-temple', component: EditTempleComponent },
    {path: 'villages', component: VillagesComponent},
    // {path: " editgoshala/:id", component: EditGoshalaComponent},
    {path:'editgoshala/:id',component:EditGoshalaComponent},
    {path: 'edit_village/:id', component: EditVillageComponent},
    {path: 'edit_event/:id', component: EditEventComponent}
    // {path: 'signup', component: SignupComponent},
    // {path: 'verify', component: VerifyComponent}

];
