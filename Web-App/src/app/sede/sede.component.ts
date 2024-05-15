import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {
  sedeForm!: FormGroup;
  nombreUnavailable: boolean = false;
  nombreChecked: boolean = false;
  places: string[] = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas', 'Guanacaste', 'Limón'];
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.sedeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      ubicacion: ['', Validators.required],
      estado: ['Activo'],
      numeroContacto: ['', Validators.required]
    });
  }

  checkNombre(): void {
    const nombre = this.sedeForm.get('nombre')?.value;
    if (!nombre) {
      return;
    }
    this.http.get<any[]>('http://127.0.0.1:5000/sedes').subscribe({
      next: (sedes: any[]) => {
        // Check if any sede has the same name as the entered one
        const nombreExists = sedes.some(sede => sede.nombre.toLowerCase() === nombre.toLowerCase());
        this.nombreUnavailable = nombreExists;
        // Set nombreChecked to true only if the name does not exist in the database
        this.nombreChecked = !nombreExists;
      },
      error: (error) => {
        this.nombreChecked = true;
      }
    });
  }

  onSubmit(): void {
    if (this.sedeForm.valid) {
      const payload = {
        nombre: this.sedeForm.value.nombre,
        ubicacion: this.sedeForm.value.ubicacion,
        estado: this.sedeForm.value.estado === 'Activo' ? 1 : 0,
        numero_contacto: this.sedeForm.value.numeroContacto
      };
      this.http.post('http://127.0.0.1:5000/sedes', payload).subscribe({
        next: () => {
          this.sedeForm.reset();
          this.sedeForm.patchValue({ estado: 'Activo' }); 
          this.nombreChecked = false;
          this.message = 'Sede creada con éxito';

          setTimeout(() => this.message = '', 3000);
        },

        error: (error) => {
          console.error('Error creating sede', error);
        }
      });
    }
  }
}