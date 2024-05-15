import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialReciclableComponent } from './material-reciclable/material-reciclable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaMaterialesComponent } from './lista-materiales/lista-materiales.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SedeComponent } from './sede/sede.component';
import { CentroComponent } from './centro/centro.component';

@NgModule({
  declarations: [
    AppComponent,
    MaterialReciclableComponent,
    ListaMaterialesComponent,
    NavbarComponent,
    SedeComponent,
    CentroComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
