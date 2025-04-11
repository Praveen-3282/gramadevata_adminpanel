import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTempleComponent } from './edit-temple.component';

describe('EditTempleComponent', () => {
  let component: EditTempleComponent;
  let fixture: ComponentFixture<EditTempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTempleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
