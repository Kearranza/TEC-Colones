import { Component } from '@angular/core';
import { CacheService } from '../cache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  username: string = '';
  password: string = '';
  rights: string = '';

  constructor(private cache: CacheService, private router: Router) { }

  onSubmit(): void {
    const user = {
      username: this.username,
      password: this.password,
      rights: this.rights
    };
    this.cache.setItem('user', user);
    this.router.navigate(['/']);
  }
}