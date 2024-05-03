import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMaterialesComponent } from './lista-materiales.component';

describe('ListaMaterialesComponent', () => {
  let component: ListaMaterialesComponent;
  let fixture: ComponentFixture<ListaMaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaMaterialesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
