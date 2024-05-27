import { Component, OnInit } from '@angular/core';
import { CacheService } from '../cache.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRights: string = '';

  constructor(private cacheService: CacheService) { }

  ngOnInit() {
    const user = this.cacheService.getItem('user');
    this.userRights = user ? user.rights : null;
  }

  removeUser() {
    this.cacheService.removeItem('user');
    this.userRights = '';
  }
}
