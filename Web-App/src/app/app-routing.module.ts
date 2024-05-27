import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialReciclableComponent } from './material-reciclable/material-reciclable.component';
import { ListaMaterialesComponent } from './lista-materiales/lista-materiales.component';
import { SedeComponent } from './sede/sede.component';
import { CentroComponent } from './centro/centro.component';
import { LogInComponent } from './log-in/log-in.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'material-reciclable', component: MaterialReciclableComponent },
  { path: 'lista-materiales', component: ListaMaterialesComponent },
  { path: 'sede', component: SedeComponent },
  { path: 'centro', component: CentroComponent },
  { path: 'logIn', component: LogInComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
