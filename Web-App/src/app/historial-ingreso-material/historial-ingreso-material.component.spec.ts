import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialIngresoMaterialComponent } from './historial-ingreso-material.component';

describe('HistorialIngresoMaterialComponent', () => {
  let component: HistorialIngresoMaterialComponent;
  let fixture: ComponentFixture<HistorialIngresoMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialIngresoMaterialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialIngresoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
