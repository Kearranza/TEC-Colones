import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})
export class SedeComponent implements OnInit {
  sedeForm!: FormGroup;
  places: string[] = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas', 'Guanacaste', 'Limón'];
  message: string = '';
  nombreMessage: string = '';
  nombreExists: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.sedeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      ubicacion: ['', Validators.required],
      estado: ['Activo'],
      numeroContacto: ['', Validators.required]
    });
  }

  // Make a check for the "nombre" field before clicking the submit button
  preCheckNombre(): void {
    this.checkNombre().subscribe(nombreExists => {
      if (nombreExists) {
        this.nombreMessage = '';
      } else {
        this.nombreMessage = 'El nombre de la sede se encuentra disponible';
      }
      setTimeout(() => this.nombreMessage = '', 3000);
    });
  }

  // Make a check for the "nombre" field when clicking the submit button
  checkNombre(): Observable<boolean> {
    const nombre = this.sedeForm.get('nombre')?.value;
    if (!nombre) {
      return of(false);
    }
    return this.http.get<any[]>('http://127.0.0.1:5000/sedes').pipe(
      map((sedes: any[]) => {
        const nombreExists = sedes.some(sede => sede.nombre.toLowerCase() === nombre.toLowerCase());
        this.nombreExists = nombreExists;
        return nombreExists;
      }),
      catchError((error) => {
        console.error('Error checking nombre', error);
        return of(false);
      })
    );
  }

  onSubmit(): void {
    this.checkNombre().subscribe(nombreExists => {
      if (this.sedeForm.valid && !nombreExists) {
        const formData = {
          nombre: this.sedeForm.value.nombre,
          ubicacion: this.sedeForm.value.ubicacion,
          estado: this.sedeForm.value.estado === 'Activo' ? 1 : 0,
          numero_contacto: this.sedeForm.value.numeroContacto
        };
        this.http.post('http://127.0.0.1:5000/sedes', formData).subscribe(
          response => {
            console.log('Success!', response);
            this.sedeForm.reset();
            this.sedeForm.patchValue({ estado: 'Activo' });
            this.message = 'Sede creada con éxito';
  
            setTimeout(() => this.message = '', 3000);
          },
          error => {
            console.error('Error creating sede', error);
          }
        );
      }
    });
  }
}