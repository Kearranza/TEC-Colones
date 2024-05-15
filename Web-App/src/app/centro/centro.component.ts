import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-centro',
  templateUrl: './centro.component.html',
  styleUrls: ['./centro.component.css']
})
export class CentroComponent implements OnInit {
  sedes: any[] = [];
  selectedSedeName: string = '';
  centroForm!: FormGroup;
  usuarioCreador = 'generalAdmin(PlaceHolder)'; // Placeholder for the actual user
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  fetchSedes(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/sedes').subscribe(sedes => {
      this.sedes = sedes;
    });
  }

  ngOnInit(): void {
    this.centroForm = this.fb.group({
      codigo: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.maxLength(1000)]],
      estado: ['Activo'],
      numero_contacto: ['', Validators.required],
      id_sede: ['', Validators.required]
    });

    this.fetchSedes();
  }

  onSubmit(): void {
    if (this.centroForm.valid) {
      const formData = { 
        ...this.centroForm.value, 
        usuario_creador: this.usuarioCreador,
        estado: this.centroForm.value.estado === 'Activo' ? 1 : 0
      };
      this.http.post('http://127.0.0.1:5000/centros', formData).subscribe(
        response => {
          console.log('Success!', response);
          this.centroForm.reset(); 
          this.centroForm.patchValue({ estado: 'Activo' }); 
          this.message = 'Centro creado con éxito'; 

          setTimeout(() => this.message = '', 3000);
        },
        error => {
          console.error('Error creating centro', error);
        }
      );
    }
  }
}