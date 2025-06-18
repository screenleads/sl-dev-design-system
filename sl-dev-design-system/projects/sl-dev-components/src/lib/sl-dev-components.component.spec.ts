import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlDevComponentsComponent } from './sl-dev-components.component';

describe('SlDevComponentsComponent', () => {
  let component: SlDevComponentsComponent;
  let fixture: ComponentFixture<SlDevComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlDevComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlDevComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
