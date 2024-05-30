import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-ingreso-material',
  templateUrl: './ingreso-material.component.html',
  styleUrls: ['./ingreso-material.component.css']
})
export class IngresoMaterialComponent implements OnInit {
  user: any;
  message: string = '';
  centros: any[] = [];
  materiales: any[] = [];
  ingresoMaterialForm = this.fb.group({
    centroAcopio: ['', Validators.required],
    carnet: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    subContainers: this.fb.array([
      this.createSubContainer()
    ])
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private cache: CacheService) { }

  ngOnInit() {
    // Populate the select with the "centros"
    this.http.get<any[]>('http://127.0.0.1:5000/centros').subscribe(centros => {
      this.centros = centros;
    });

    // Populate the select with the "materiales"
    this.http.get<any[]>('http://127.0.0.1:5000/materiales').subscribe(materiales => {
      this.materiales = materiales;
    });

    this.user = this.cache.getItem('user');
    console.log(this.user);
    if (this.user && this.user.centro) {
      let centroAcopioControl = this.ingresoMaterialForm.get('centroAcopio');
      if (centroAcopioControl) {
        centroAcopioControl.setValue(this.user.centro, { emitEvent: false });
        centroAcopioControl.disable();
      }
    }
    // Subscribe to changes in the value of 'material' and 'cantidadMaterial'
    this.subContainers.controls.forEach((value: AbstractControl, index: number) => {
      const subContainer = value as FormGroup;
      const materialControl = subContainer.get('material');
      if (materialControl) {
        materialControl.valueChanges.subscribe(materialId => {
          const selectedMaterial = this.materiales.find(material => material.id === materialId);
          this.updateTecColones(selectedMaterial, subContainer.get('cantidadMaterial')?.value, index);
        });
      }
    
      const cantidadMaterialControl = subContainer.get('cantidadMaterial');
      if (cantidadMaterialControl) {
        cantidadMaterialControl.valueChanges.subscribe(cantidad => {
          const selectedMaterial = this.materiales.find(material => material.id === subContainer.get('material')?.value);
          this.updateTecColones(selectedMaterial, cantidad, index);
        });
      }
    });
  }

  updateTecColones(selectedMaterial: { valor_unitario: number; }, cantidad: string | number | null | undefined, subContainerIndex: number): Observable<any> {
    if (selectedMaterial && cantidad) {
      const tecColones = (Number(cantidad) * selectedMaterial.valor_unitario).toString();
      const subContainer = this.subContainers.at(subContainerIndex) as FormGroup;
      const tecColonesControl = subContainer.get('tecColones');
      if (tecColonesControl) {
        tecColonesControl.setValue(tecColones, { emitEvent: false });
      }
    }
    return new Observable(); 
  }

  createSubContainer(): FormGroup {
    return this.fb.group({
      material: ['', Validators.required],
      cantidadMaterial: ['', Validators.required],
      tecColones: ['', Validators.required]
    });
  }

  addSubContainer() {
    const subContainer = this.createSubContainer();
    this.subContainers.push(subContainer);
  
    const index = this.subContainers.length - 1;
  
    const materialControl = subContainer.get('material');
    if (materialControl) {
      materialControl.valueChanges.subscribe(materialId => {
        const selectedMaterial = this.materiales.find(material => material.id === materialId);
        this.updateTecColones(selectedMaterial, subContainer.get('cantidadMaterial')?.value, index);
      });
    }
  
    const cantidadMaterialControl = subContainer.get('cantidadMaterial');
    if (cantidadMaterialControl) {
      cantidadMaterialControl.valueChanges.subscribe(cantidad => {
        const selectedMaterial = this.materiales.find(material => material.id === subContainer.get('material')?.value);
        this.updateTecColones(selectedMaterial, cantidad, index);
      });
    }
  }

  removeSubContainer(index: number): void {
    this.subContainers.removeAt(index);
  }

  get subContainers(): FormArray {
    return this.ingresoMaterialForm.get('subContainers') as FormArray;
  }
  

  getUnidad(index: number): string {
    const subContainer = this.subContainers.at(index);
    const materialId = subContainer.get('material')?.value;
    const selectedMaterial = this.materiales.find(material => material.id === materialId);
    return selectedMaterial?.unidad || '';
  }

  onSubmit() {
    if (this.ingresoMaterialForm.valid) {
      const formData = this.ingresoMaterialForm.getRawValue();
      const ingresoMaterials = formData.subContainers.map((subContainer: any) => {
        return {
          codigo_centro_acopio: formData.centroAcopio,
          estudiante: formData.carnet,
          monto: subContainer.tecColones,
          id_material: subContainer.material,
          cantidad: subContainer.cantidadMaterial
        };
      });
  
      ingresoMaterials.forEach(ingresoMaterial => {
        this.http.post('http://127.0.0.1:5000/cambios', ingresoMaterial).subscribe(response => {
          // Handle response here
        }, error => {
          console.error(error);
        });
      });
  
      this.ingresoMaterialForm.reset();
  
      // Capture the values before resetting the form
      const centroAcopioValue = formData.centroAcopio;
      const carnetValue = formData.carnet;
  
      this.ingresoMaterialForm.reset();
  
      // Set the values back
      const centroAcopioControl = this.ingresoMaterialForm.get('centroAcopio');
      if (centroAcopioControl) {
        centroAcopioControl.setValue(centroAcopioValue, { emitEvent: false });
      }
  
      const carnetControl = this.ingresoMaterialForm.get('carnet');
      if (carnetControl) {
        carnetControl.setValue(carnetValue, { emitEvent: false });
      }
  
      this.message = 'El ingreso de material ha sido efectuado.';
  
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
}