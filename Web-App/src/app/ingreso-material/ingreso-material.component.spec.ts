import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoMaterialComponent } from './ingreso-material.component';

describe('IngresoMaterialComponent', () => {
  let component: IngresoMaterialComponent;
  let fixture: ComponentFixture<IngresoMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngresoMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
