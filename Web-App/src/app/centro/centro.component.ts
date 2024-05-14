import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-centro',
  templateUrl: './centro.component.html',
  styleUrls: ['./centro.component.css']
})
export class CentroComponent implements OnInit {
  centroForm!: FormGroup;
  usuarioCreador = 'generalAdmin(PlaceHolder)'; 

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.centroForm = this.fb.group({
      codigo: ['', Validators.required],
      ubicacion: ['', Validators.required],
      estado: ['', Validators.required],
      numero_contacto: ['', Validators.required],
      id_sede: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.centroForm.valid) {
      const formData = { ...this.centroForm.value, usuario_creador: this.usuarioCreador };
      this.http.post('http://127.0.0.1:5000/centros', formData).subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      );
    }
  }
}