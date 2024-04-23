import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReciclableComponent } from './material-reciclable.component';

describe('MaterialReciclableComponent', () => {
  let component: MaterialReciclableComponent;
  let fixture: ComponentFixture<MaterialReciclableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialReciclableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialReciclableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
