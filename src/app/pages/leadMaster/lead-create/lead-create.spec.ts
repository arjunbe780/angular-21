import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCreate } from './lead-create';

describe('LeadCreate', () => {
  let component: LeadCreate;
  let fixture: ComponentFixture<LeadCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
