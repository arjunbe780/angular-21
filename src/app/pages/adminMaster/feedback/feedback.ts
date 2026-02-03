import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  imports: [ReactiveFormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  showModal = false;
  private fb = inject(FormBuilder);
  feedbackForm = this.fb.group({
    category: ['', [Validators.required]],
    status: ['', [Validators.required]],
    feedback: ['', [Validators.required]],
  });

  submit(){
    console.log(this.feedbackForm.value);
  }
}
