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

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.sedeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      ubicacion: ['', Validators.required],
      estado: ['activo'],
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
        this.nombreChecked = true;
      },
      error: (error) => {
        console.error('Error fetching sedes', error);
      }
    });
  }

  onSubmit(): void {
    if (this.sedeForm.valid && this.nombreChecked && !this.nombreUnavailable) {
      this.http.post('http://127.0.0.1:5000/sedes', this.sedeForm.value).subscribe({
        next: (response) => {
          console.log('Sede created successfully', response);
          // Handle successful creation (e.g., display a success message or redirect)
        },
        error: (error) => {
          console.error('Error creating sede', error);
          // Handle error (e.g., display an error message)
        }
      });
    }
  }
}