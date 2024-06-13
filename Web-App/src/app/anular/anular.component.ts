import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
  styleUrl: './anular.component.css'
})
export class AnularComponent implements OnInit {
  form!: FormGroup;
  centros: any[] = [];
  materiales: any[] = [];
  historial: any[] = [];
  filtredHistorial: any[] = [];
  message: string = '';
  currentSortColumn = '';
  sortAscending = true;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      carnet: [''],
      tipo: [''],
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required]
    });

    this.fetchSedes();
    this.fetchHistorial();
    this.fetchMaterial();

  }

  // Show the estado as a string
  estadoToString(estado: number): string {
    switch (estado) {
      case 0: return 'Vigente';
      case 1: return 'Anulada';
      case 3: return 'Anulación';
      default: return 'Unknown';
    }
  }


  // Sort the historial by the column
  sort(column: string): void {
    this.currentSortColumn = column;
    this.sortAscending = !this.sortAscending;

    this.filtredHistorial.sort((a, b) => {
      if (a[column] < b[column]) {
        return this.sortAscending ? -1 : 1;
      } else if (a[column] > b[column]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  // Fetch all the "sedes"
  fetchSedes(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/centros').subscribe(centros => {
      this.centros = centros;
    });
  }

  // Fetch all the "cambios"
  fetchHistorial(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/cambios').subscribe(historial => {
      this.historial = historial;
    });
  }

  // Fetch all the "materiales"
  fetchMaterial(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/materiales').subscribe(materiales => {
      this.materiales = materiales;
    });
  }

  // Map the material names to the historial by id
  mapMaterialNames(): void {
    this.filtredHistorial = this.filtredHistorial.map(item => {
      const material = this.materiales.find(material => material.id === item.id_material);
      return {
        ...item,
        id_material: material ? material.nombre : item.id_material
      };
    });
  }

  onSubmit(): void {
    const carnet = this.form.get('carnet')?.value;
    const tipo = this.form.get('tipo')?.value;
    const fechaInicial = new Date(`${this.form.get('fechaInicial')?.value}T00:00:00`);
    const fechaFinal = new Date(`${this.form.get('fechaFinal')?.value}T23:59:59`);
  
    this.filtredHistorial = this.historial.filter(item => {
      const fechaTransaccion = new Date(item.fecha_transaccion);
      const fechaTransaccionWithoutTime = new Date(fechaTransaccion.getFullYear(), fechaTransaccion.getMonth(), fechaTransaccion.getDate());
  
      return (carnet ? item.carnet === carnet : true) &&
        (tipo ? item.tipo === tipo : true) &&
        fechaTransaccionWithoutTime >= fechaInicial &&
        fechaTransaccionWithoutTime <= fechaFinal;
    });
  
    this.mapMaterialNames();
  
    if (this.filtredHistorial.length > 0) {
      this.message = 'Búsqueda realizada con éxito';
    } else {
      this.message = 'No se encontraron datos coincidentes';
    }
  
    setTimeout(() => this.message = '', 3000);
  }
}