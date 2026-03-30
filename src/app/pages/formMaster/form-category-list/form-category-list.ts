import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
export interface Category {
  id: number;
  category_id: string;
  business_category_name: string;
  category_tags: any;
  description: string;
  business_category_status: number;
  is_published: number | string;
  is_publish_available: number;
  current_version_id: number;
  status_label: string;
  total_forms: number;
  total_active_forms: number;
  created_date: string;
  updated_date: string;
  created_user: string;
  updated_user: string;
  deleted_user: any;
}
@Component({
  selector: 'app-form-category-list',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './form-category-list.html',
  styleUrl: './form-category-list.css',
})
export class FormCategoryList implements OnInit {
  private http = inject(HttpClient);

  // Use the interface here for better autocomplete
  leadList = signal<Category[]>([]);
  isLoading = signal(false); // Useful for showing a spinner
  pageNumber = signal(1);
  totalPages = signal(0);
  leadStatus = signal('');
  tableHeader = [
    '#',
    'Category Id',
    'Category Name',
    'Forms Count',
    'Active Form',
    'Created Date',
    'Created By',
    'Update Status',
    'Action',
  ];
  private fb = inject(FormBuilder);

  showModal = signal(false);
  isEditMode = signal(false);
  selectedId = signal<number | null>(null);
  isSaving = signal(false);

  categoryForm = this.fb.nonNullable.group({
    business_category_name: ['', [Validators.required]],
    business_category_status: [1, [Validators.required]],
    description: ['', [Validators.required]],
  });
  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.isLoading.set(true);

    const payload = {
      page: this.pageNumber(),
      page_size: 15,
    };

    let params = new HttpParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.append(key, value.toString());
      }
    });
    this.http.get<any>('business-category/list? ', { params }).subscribe({
      next: (res) => {
        // Based on your console.log(res.data.data)
        this.leadList.set(res.data.result);
        this.totalPages.set(Math.ceil(res.data.total_records / 15));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading.set(false);
      },
    });
  }

  handlePageChange(page: number) {
    this.pageNumber.set(page);
    this.isLoading.set(true);

    this.getAllCategory();
  }
  handleOptionChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.leadStatus.set(value);
    this.isLoading.set(true);
    this.pageNumber.set(1);
    this.getAllCategory();
  }

  saveCategory() {
    if (this.categoryForm.invalid || this.isSaving()) return;

    // Set saving to true to block further clicks
    this.isSaving.set(true);

    const payload = this.isEditMode()
      ? { ...this.categoryForm.value, id: this.selectedId() }
      : this.categoryForm.value;

    const request$ = this.isEditMode()
      ? this.http.put(`business-category/update`, payload)
      : this.http.post(`business-category/create`, payload);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.getAllCategory();
        this.isSaving.set(false); // Reset on success
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false); // Reset on error so user can try again
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.categoryForm.reset();
    this.showModal.set(true);
  }

  handleEdit(data: any) {
    this.isEditMode.set(true);
    this.selectedId.set(data.id);
    this.categoryForm.patchValue(data);
    this.showModal.set(true);
  }
}
