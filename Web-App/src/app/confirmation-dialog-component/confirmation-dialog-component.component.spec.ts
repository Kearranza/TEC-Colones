import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponentComponent } from './confirmation-dialog-component.component';

describe('ConfirmationDialogComponentComponent', () => {
  let component: ConfirmationDialogComponentComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
