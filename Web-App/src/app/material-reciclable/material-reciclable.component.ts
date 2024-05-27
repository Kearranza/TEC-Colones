import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ACTIVE } from '../constants';

@Component({
  selector: 'app-material-reciclable',
  templateUrl: './material-reciclable.component.html',
  styleUrls: ['./material-reciclable.component.css']
})


export class MaterialReciclableComponent implements OnInit {

  message: string = '';
  materialForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {

    this.materialForm = this.fb.group({
      materialName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      unit: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      status: [ACTIVE],
      description: ['', Validators.maxLength(1000)]
    });

  }

  onSubmit(): void {
    if (this.materialForm.valid) {
      // Create a new material object with the form values
      const material = {
        nombre: this.materialForm.value.materialName,
        unidad: this.materialForm.value.unit,
        valor_unitario: this.materialForm.value.unitValue,
        estado: this.materialForm.value.status === ACTIVE ? 1 : 0,
        descripcion: this.materialForm.value.description
      };

      // Make a POST request to the API
      this.http.post('http://127.0.0.1:5000/materiales', material).subscribe(response => {
        // Reset the form
        this.materialForm.reset();

        this.materialForm.patchValue({
          status: ACTIVE,
        });
        this.message = 'El material ha sido creado.';

        // Clear the message after 3 seconds
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }, error => {
        // If the request fails, log the error to the console
        console.error(error);
      });
    }
  }

}