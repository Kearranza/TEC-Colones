import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-historial-ingreso-material',
  templateUrl: './historial-ingreso-material.component.html',
  styleUrls: ['./historial-ingreso-material.component.css']
})
export class HistorialIngresoMaterialComponent implements OnInit {
  form!: FormGroup;
  centros: any[] = [];
  historial: any[] = [];
  filtredHistorial: any[] = [];
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      centro: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required]
    });

    this.fetchSedes();
    this.fetchHistorial();

  }

  // Fetch all the "sedes"
  fetchSedes(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/centros').subscribe(centros => {
      this.centros = centros;
    });
  }

  // Fetch all the "centros"
  fetchHistorial(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/cambios').subscribe(historial => {
      this.historial = historial;
    });
  }

  onSubmit(): void {
    const centro = this.form.get('centro')?.value;
    const fechaInicial = new Date(`${this.form.get('fechaInicial')?.value}T00:00:00`);
    const fechaFinal = new Date(`${this.form.get('fechaFinal')?.value}T23:59:59`);

    this.filtredHistorial = this.historial.filter(item => {
      const fechaTransaccion = new Date(item.fecha_transaccion);
      const fechaTransaccionWithoutTime = new Date(fechaTransaccion.getFullYear(), fechaTransaccion.getMonth(), fechaTransaccion.getDate());

      return item.codigo_centro_acopio === centro &&
        fechaTransaccionWithoutTime >= fechaInicial &&
        fechaTransaccionWithoutTime <= fechaFinal;
    });

    if (this.filtredHistorial.length > 0) {
      this.message = 'Búsqueda realizada con éxito';
    } else {
      this.message = 'No se encontraron datos coincidentes';
    }

    setTimeout(() => this.message = '', 3000);
  }
}