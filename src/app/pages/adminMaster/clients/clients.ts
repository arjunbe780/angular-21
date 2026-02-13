import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { HasRoleDirective } from '../../../directives/HasRoleDirective';

@Component({
  selector: 'app-clients',
  imports: [ReactiveFormsModule, CommonModule, HasRoleDirective],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  orderForm: FormGroup;

  qty = signal(5);
  price = signal(10);
  total = computed(() => this.qty() * this.price());
  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      items: this.fb.array([]),
    });
    effect(() => {
      console.log('total-----', this.total() * 2);
    });
  }
counterObservable = interval(1000);
 counter = toSignal(this.counterObservable, {initialValue: 0});
  @ViewChild('input') inputRef!: ElementRef;

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
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
        required: 'Customer name is mandatory',
      });
      return;
    }

    console.log(this.orderForm.value);
  }

  increment() {
    this.qty.update((n) => n + 1);
  }
}
