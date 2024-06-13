import { Component, OnInit } from '@angular/core';
import { CacheService } from '../cache.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  message: string = '';
  loginForm: FormGroup = new FormGroup({});

  constructor(private cache: CacheService, private router: Router, private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.get<any[]>('http://127.0.0.1:5000/usuarios').subscribe(users => {
        const user = users.find(u => u.Usuario === this.loginForm.value.user);

        // If the user does not exist, display a message
        if (!user) {
          this.message = 'El usuario no existe';
          setTimeout(() => {
            this.message = '';
          }, 3000);

          // If the password is incorrect, display a message
        } else if (user.Contraseña !== this.loginForm.value.password) {
          this.message = 'El usuario y contraseña no coinciden';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        } else {
          const userCache = {
            username: user.Usuario,
            rights: user.Permisos,
            centro: user.Codigo_Centro_Acopio
          };
          this.cache.setItem('user', userCache);
          this.router.navigate(['/']);
        }
      });
    }
  }
}