import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Simplified interfaces for clarity
export interface FeedbackResult {
  id: number;
  feedback_type: string;
  feedback_message: string;
  feedback_status: number;
  created_date: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // Signals for state management
  feedbackList = signal<FeedbackResult[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isEditMode = signal(false);
  selectedId = signal<number | null>(null);
  pageNumber = signal(1);
  isSaving = signal(false);

  // Status Lookup Object
  readonly statusMap: Record<number, string> = {
    0: 'Pending',
    1: 'Submitted',
    2: 'Rejected',
    3: 'Re-Submitted',
    4: 'Active',
    5: 'Blocked',
  };

  feedbackForm = this.fb.nonNullable.group({
    feedback_type: ['Went Well', [Validators.required]],
    feedback_status: [1, [Validators.required]], // Kept as number
    feedback_message: ['', [Validators.required]],
  });

  tableHeader = ['#', 'Category', 'Status', 'Feedback', 'Actions',"Delete"];

  ngOnInit(): void {
    this.getFeedbackList();
  }

  getFeedbackList() {
    this.isLoading.set(true);
    this.http.get<any>(`feedback-form/list?page=1&page_size=10&order_by=desc`).subscribe({
      next: (res) => {
        this.feedbackList.set(res.data.result);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.feedbackForm.reset();
    this.showModal.set(true);
  }

  handleEdit(data: FeedbackResult) {
    this.isEditMode.set(true);
    this.selectedId.set(data.id);
    this.feedbackForm.patchValue(data);
    this.showModal.set(true);
  }


  saveFeedback() {
    if (this.feedbackForm.invalid || this.isSaving()) return;

    // Set saving to true to block further clicks
    this.isSaving.set(true);

    const payload = this.isEditMode()
      ? { ...this.feedbackForm.value, id: this.selectedId() }
      : this.feedbackForm.value;

    const request$ = this.isEditMode()
      ? this.http.put(`feedback-form/update`, payload)
      : this.http.post(`feedback-form/create`, payload);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.getFeedbackList();
        this.isSaving.set(false); // Reset on success
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false); // Reset on error so user can try again
      },
    });
  }
  deleteFeedback(id: number) {
    if (confirm('Are you sure?')) {
      this.http
        .delete(`feedback-form/delete`, {
          body: {
            id,
          },
        })
        .subscribe(() => this.getFeedbackList());
    }
  }
  closeModal() {
    this.showModal.set(false);
  }
}
