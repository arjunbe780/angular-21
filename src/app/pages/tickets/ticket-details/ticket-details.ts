import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit {
   private _snackBar = inject(MatSnackBar);
  ticket = signal<any>(null);
  @Input() id!: string;
  http = inject(HttpClient);
  showModal = signal(false);
  private fb = inject(FormBuilder);
  isSaving = signal(false);
  ticketId = signal(0);
  constructor() {
    effect(() => {
      console.log('hgduytdt');
    });
    // This is where you'd typically fetch your JSON
  }
  ticketForm = this.fb.nonNullable.group({
    remarks: ['', [Validators.required]],
  });
  ngOnInit(): void {
    console.log(this.id);
    this.getTicketDetails();
  }
  openAddModal() {
    this.ticketForm.reset();
    this.showModal.set(true);
  }
  getTicketDetails() {
    this.http.get<Observable<any>>(`ticket-details?id=${this.id}&user_type=agent`).subscribe({
      next: (res: any) => {
        this.ticket.set(res.data);
        console.log(res);
          this._snackBar.open('Ticket Updated Successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => console.log(err),
    });
  }

  closeModal() {
    this.showModal.set(false);
  }
  updateTicket() {
    const payload = {
      id: this.id,
      comment: this.ticketForm.value.remarks,
      status: 2,
    };
    this.http.post<any>(`ticket/update-status`, payload).subscribe({
      next: () => {
        this.showModal.set(false);
        this.getTicketDetails();
        this.isSaving.set(false); // Reset on success
        this._snackBar.open('Ticket Updated Successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false); // Reset on error so user can try again
             this._snackBar.open('Something went wrong', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
