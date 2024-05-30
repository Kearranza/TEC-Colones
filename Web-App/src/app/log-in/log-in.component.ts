import { Component, OnInit } from '@angular/core';
import { CacheService } from '../cache.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  username: string = '';
  rights: string = '';
  centro: string = '';
  centros: any[] = [];

  constructor(private cache: CacheService, private router: Router, private http: HttpClient) { }

  fetchCentros(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/centros').subscribe(centros => {
      this.centros = centros;
    });
  }

  ngOnInit() {
    this.fetchCentros();
  }

  onSubmit(): void {
    const user = {
      username: this.username,
      rights: this.rights,
      centro: this.centro
    };
    this.cache.setItem('user', user);
    this.router.navigate(['/']);
  }
}