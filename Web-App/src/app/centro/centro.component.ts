import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ACTIVE } from '../constants';

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
  codigoMessage: string = '';
  codigoExists: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  // Fetch all the "sedes"
  fetchSedes(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/sedes').subscribe(sedes => {
      this.sedes = sedes;
    });
  }

  // Make a check for the "codigo" field before clicking the submit button
  preCheckCodigo(): void {
    this.checkCodigo().subscribe(codigoExists => {
      if (codigoExists) {
        this.codigoMessage = '';
      } else {
        this.codigoMessage = 'El código se encuentra disponible';
      }
      setTimeout(() => this.codigoMessage = '', 3000);
    });
  }

  // Check if the "codigo" already exists
  checkCodigo(): Observable<boolean> {
    const codigo = this.centroForm.get('codigo')?.value;
    if (!codigo) {
      return of(false);
    }
    return this.http.get<any[]>('http://127.0.0.1:5000/centros').pipe(
      map((centros: any[]) => {
        const codigoExists = centros.some(centro => centro.codigo === codigo);
        this.codigoExists = codigoExists;
        return codigoExists;
      }),
      catchError((error) => {
        console.error('Error checking codigo', error);
        return of(false);
      })
    );
  }

  ngOnInit(): void {
    this.centroForm = this.fb.group({
      codigo: ['', Validators.required],
      ubicacion: ['', [Validators.required, Validators.maxLength(1000)]],
      estado: [ACTIVE],
      numero_contacto: ['', Validators.required],
      id_sede: ['', Validators.required]
    });

    this.fetchSedes();
  }

  onSubmit(): void {
    this.checkCodigo().subscribe(codigoExists => {
      if (this.centroForm.valid && !codigoExists) {
        const formData = {
          ...this.centroForm.value,
          usuario_creador: this.usuarioCreador,
          estado: this.centroForm.value.estado === ACTIVE ? 1 : 0
        };
        this.http.post('http://127.0.0.1:5000/centros', formData).subscribe(
          response => {
            console.log('Success!', response);
            this.centroForm.reset();
            this.centroForm.patchValue({ estado: ACTIVE });
            this.message = 'Centro creado con éxito';
  
            setTimeout(() => this.message = '', 3000);
          },
          error => {
            console.error('Error creating centro', error);
          }
        );
      }
    });
  }
}