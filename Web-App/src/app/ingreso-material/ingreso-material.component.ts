import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { Observable, switchMap } from 'rxjs';
import { BASE_URL } from '../constants';

@Component({
  selector: 'app-ingreso-material',
  templateUrl: './ingreso-material.component.html',
  styleUrls: ['./ingreso-material.component.css']
})
export class IngresoMaterialComponent implements OnInit {
  user: any;
  message: string = '';
  messageError: string = '';
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
      this.materiales = materiales.filter(material => material.estado === 1);
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


  // Update the value of 'tecColones' based on the selected material and the quantity
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

  // Create a new subContainer to the form
  createSubContainer(): FormGroup {
    return this.fb.group({
      material: ['', Validators.required],
      cantidadMaterial: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      tecColones: ['', Validators.required]
    });
  }

  // Add a new subContainer to the form.
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

  // Remove the subContainer at the specified index
  removeSubContainer(index: number): void {
    this.subContainers.removeAt(index);
  }

  get subContainers(): FormArray {
    return this.ingresoMaterialForm.get('subContainers') as FormArray;
  }

  // Get the "unidad" of the selected material
  getUnidad(index: number): string {
    const subContainer = this.subContainers.at(index);
    const materialId = subContainer.get('material')?.value;
    const selectedMaterial = this.materiales.find(material => material.id === materialId);
    return selectedMaterial?.unidad || '';
  }

  onSubmit() {
    // Validate the student ID
    const carnet = this.ingresoMaterialForm.get('carnet')?.value;
    this.http.get<{ ResponseCode: number, Message: string }>( BASE_URL + 'https://cuentatec.azurewebsites.net/api/StudentValidator?carnet=' + (carnet?.toString() ?? ''))
      .subscribe(response => {
        // Student ID is valid
        if (response.ResponseCode === 200) {
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
              const postData = { ...ingresoMaterial, estado: 0 };
              this.http.post('http://127.0.0.1:5000/cambios', postData).subscribe(response => {
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
            this.subContainers.clear();

            this.message = 'El ingreso de material ha sido efectuado.';

            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
        }
      }, error => {
        this.messageError = 'El carnet ingresado no existe.';

        setTimeout(() => {
          this.messageError = '';
        }, 6000);

        console.error(error);
      });

  }
}