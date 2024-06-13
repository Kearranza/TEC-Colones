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
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IngresoMaterialComponent } from './ingreso-material/ingreso-material.component';
import { HistorialIngresoMaterialComponent } from './historial-ingreso-material/historial-ingreso-material.component';
import { AnularComponent } from './anular/anular.component';

@NgModule({
  declarations: [
    AppComponent,
    MaterialReciclableComponent,
    ListaMaterialesComponent,
    NavbarComponent,
    SedeComponent,
    CentroComponent,
    LogInComponent,
    LandingPageComponent,
    IngresoMaterialComponent,
    HistorialIngresoMaterialComponent,
    AnularComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
