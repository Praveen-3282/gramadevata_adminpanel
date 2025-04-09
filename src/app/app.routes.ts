import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { TemplesComponent } from './temples/temples.component';
import { EventsComponent } from './events/events.component';
import { GoshalasComponent } from './goshalas/goshalas.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'header', component: HeaderComponent},
    {path: 'temples', component: TemplesComponent},
    {path: 'events', component: EventsComponent},
    {path: 'goshalas', component: GoshalasComponent},
    // {path: 'signup', component: SignupComponent},
    // {path: 'verify', component: VerifyComponent}

];
