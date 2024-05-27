import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// CacheService class to store and retrieve data across the application
export class CacheService {

  constructor() { }

  // Set data in local storage by key name so that it can be retrieved later
  setItem(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Get data from local storage by key name 
  getItem(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  // Remove data from local storage by key name
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}