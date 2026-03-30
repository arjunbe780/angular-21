import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoryList } from './form-category-list';

describe('FormCategoryList', () => {
  let component: FormCategoryList;
  let fixture: ComponentFixture<FormCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
