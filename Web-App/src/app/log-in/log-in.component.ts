import { Component } from '@angular/core';
import { CacheService } from '../cache.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  username = '';
  password = '';
  rights = '';

  constructor(private cache: CacheService) { }

  onSubmit(): void {
    const user = {
      username: this.username,
      password: this.password,
      rights: this.rights
    };
    this.cache.setItem('user', user);
  }
}