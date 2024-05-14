import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialReciclableComponent } from './material-reciclable/material-reciclable.component';
import { ListaMaterialesComponent } from './lista-materiales/lista-materiales.component';
import { SedeComponent } from './sede/sede.component';
import { CentroComponent } from './centro/centro.component';

const routes: Routes = [
  { path: 'material-reciclable', component: MaterialReciclableComponent },
  { path: '', redirectTo: '/material-reciclable', pathMatch: 'full' },
  { path: 'lista-materiales', component: ListaMaterialesComponent },
  { path: 'sede', component: SedeComponent },
  { path: 'centro', component: CentroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
