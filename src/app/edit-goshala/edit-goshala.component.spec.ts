import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoshalaComponent } from './edit-goshala.component';

describe('EditGoshalaComponent', () => {
  let component: EditGoshalaComponent;
  let fixture: ComponentFixture<EditGoshalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGoshalaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGoshalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
