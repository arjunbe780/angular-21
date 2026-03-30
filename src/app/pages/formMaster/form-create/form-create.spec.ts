import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreate } from './form-create';

describe('FormCreate', () => {
  let component: FormCreate;
  let fixture: ComponentFixture<FormCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
