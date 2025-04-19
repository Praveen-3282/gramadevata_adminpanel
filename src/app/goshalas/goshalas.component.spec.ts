import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoshalasComponent } from './goshalas.component';

describe('GoshalasComponent', () => {
  let component: GoshalasComponent;
  let fixture: ComponentFixture<GoshalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoshalasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoshalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
