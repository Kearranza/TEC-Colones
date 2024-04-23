import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Material {
  materialName: string;
  unit: string;
  unitValue: number;
  status: string;
  creationDate: string;
  description: string;
  materialId: string;
}

@Component({
  selector: 'app-material-reciclable',
  templateUrl: './material-reciclable.component.html',
  styleUrls: ['./material-reciclable.component.css']
})


export class MaterialReciclableComponent implements OnInit {

  creationDate: string | undefined;
  materialId: string | undefined;
  materialForm: FormGroup = new FormGroup({});
  materials: Material[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.creationDate = new Date().toISOString().split('T')[0];
    this.materialId = 'M-' + Math.random().toString(36).substr(2, 12);

    this.materialForm = this.fb.group({
      materialName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      unit: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      status: ['Activo'],
      creationDate: [{ value: this.creationDate, disabled: true }],
      description: ['', Validators.maxLength(1000)],
      materialId: [{ value: this.materialId, disabled: true }]
    });
  }
  onSubmit(): void {
    if (this.materialForm.valid) {
      // Create a new material object with the form values
      const material: Material = this.materialForm.value;
      material.materialId = 'M-' + Math.random().toString(36).substr(2, 12);
      material.creationDate = new Date().toISOString().split('T')[0];
      this.materials.push(material);
      this.materialForm.reset();

      // Generate new ID and date for the next material
      this.materialId = 'M-' + Math.random().toString(36).substr(2, 12);
      this.creationDate = new Date().toISOString().split('T')[0];

      // Update the form with the new ID and date
      this.materialForm.patchValue({
        materialId: this.materialId,
        creationDate: this.creationDate
      });
    }
  }
}