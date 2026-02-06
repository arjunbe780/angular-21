import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css',
})
export class TicketDetails implements OnInit {
  ticket = signal<any>(null);
  @Input() id!: string;
  http = inject(HttpClient);
  constructor() {
    // This is where you'd typically fetch your JSON
  }
  ngOnInit(): void {
    console.log(this.id);
    this.getTicketDetails ();
  }

  getTicketDetails() {
    this.http.get<any>(`ticket-details?id=${this.id}`).subscribe({
      next: (res) => {
        this.ticket.set(res.data);
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }

  onCloseTicket(ticketId: number) {
    if (confirm('Are you sure you want to close this ticket?')) {
      console.log('Closing ticket ID:', ticketId);
      // Call your service here: this.ticketService.close(ticketId).subscribe(...)
    }
  }
}
