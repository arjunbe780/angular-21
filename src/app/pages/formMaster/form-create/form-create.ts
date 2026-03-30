import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-create',
  standalone: true, // Assuming standalone based on imports
  imports: [ReactiveFormsModule, TitleCasePipe, NgClass],
  templateUrl: './form-create.html',
  styleUrl: './form-create.css',
})
export class FormCreate implements OnInit {
  form!: FormGroup;

  // Added all your required types here
  elementTypes = [
    'text',
    'textarea',
    'number',
    'email',
    'url',
    'select',
    'radio',
    'toggle',
    'checkbox',
    'file',
    'date',
    'stepper',
    'time_range',
    'range_slider',
    'rating_scale',
    'dynamic_table',
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      business_category: [''],
      builders_form_section_id: [''],
      section_status: [''],
      elements: this.fb.array([]),
    });
  }

  get elements(): FormArray {
    return this.form.get('elements') as FormArray;
  }

  createField(): FormGroup {
    return this.fb.group({
      // Adding Validators.required here
      element_type: ['', Validators.required],
      label_name: ['', Validators.required],
      element_name: [''],

      element_attributes: this.fb.group({
        placeholder: [''],
        is_required: [0],
        minlength: [null],
        maxlength: [null],
        min: [null],
        max: [null],
        step: [1],
        options: [[]],
        is_multiple: [false],
        text_type_validation: [''],
        number_type_validation: [''],
        min_date: [null],
        max_date: [null],
        file_size: [null],
        file_formats: [[]],
        max_file_count: [null],
        is_signature_pad: [false],
        mask_image: [''],
      }),
    });
  }
  setOptions(event: any, index: number) {
    const value = event.target.value;
    const optionsArray = value ? value.split(',').map((o: string) => o.trim()) : [];
    this.elements.at(index).get('element_attributes.options')?.setValue(optionsArray);
  }

  addField() {
    this.elements.push(this.createField());
  }

  removeField(index: number) {
    this.elements.removeAt(index);
  }

  // Syncs the checkbox UI with the 1/0 value needed for your backend/schema
  toggleRequired(event: any, index: number) {
    const control = this.elements.at(index).get('element_attributes.is_required');
    control?.setValue(event.target.checked ? 1 : 0);
  }

  submitForm() {
    // Before submitting, you might want to auto-generate element_name
    // from label_name if it's empty (e.g., "Your Age" -> "your_age")
    const finalData = this.form.value;
    console.log('Generated Schema Configuration:', JSON.stringify(finalData, null, 2));
  }
}
