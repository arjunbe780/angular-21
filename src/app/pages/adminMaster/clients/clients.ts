import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addItem();
  }

  // 👉 Easy access to items FormArray
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // 👉 Create single item FormGroup
  createItem(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  // ➕ Add item
  addItem() {
    this.items.push(this.createItem());
  }

  // ❌ Remove item
  removeItem(index: number) {
    this.items.removeAt(index);
  }

  // 📦 Submit form
onSubmit() {
  if (this.orderForm.invalid) {
    this.orderForm.get('customerName')?.setErrors({
      required: 'Customer name is mandatory'
    });
    return;
  }

  console.log(this.orderForm.value);
}

}
