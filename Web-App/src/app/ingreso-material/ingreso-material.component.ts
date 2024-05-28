import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ingreso-material',
  templateUrl: './ingreso-material.component.html',
  styleUrls: ['./ingreso-material.component.css']
})
export class IngresoMaterialComponent implements OnInit {
  message: string = '';
  ingresoMaterialForm = this.fb.group({
    centroAcopio: ['', Validators.required],
    carnet: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    material: ['', Validators.required],
    cantidadMaterial: ['', Validators.required],
    tecColones: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.ingresoMaterialForm.valid) {
      const ingresoMaterial = {
        centroAcopio: this.ingresoMaterialForm.value.centroAcopio,
        carnet: this.ingresoMaterialForm.value.carnet,
        material: this.ingresoMaterialForm.value.material,
        cantidadMaterial: this.ingresoMaterialForm.value.cantidadMaterial,
        tecColones: this.ingresoMaterialForm.value.tecColones
      };

      this.http.post('http://127.0.0.1:5000/ingreso-material', ingresoMaterial).subscribe(response => {
        this.ingresoMaterialForm.reset();
        this.message = 'El ingreso de material ha sido efectuado.';

        setTimeout(() => {
          this.message = '';
        }, 3000);
      }, error => {
        console.error(error);
      });
    }
  }
}