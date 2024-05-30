import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Material {
  descripcion: string;
  estado: number;
  fecha_creacion: string;
  id: string;
  nombre: string;
  unidad: string;
  valor_unitario: number;
}

@Component({
  selector: 'app-lista-materiales',
  templateUrl: './lista-materiales.component.html',
  styleUrls: ['./lista-materiales.component.css']
})

export class ListaMaterialesComponent implements OnInit {
  materials: Material[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Material[]>('http://127.0.0.1:5000/materiales').subscribe(materials => {
      this.materials = materials;
    });
  }

}