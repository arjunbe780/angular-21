import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Root {
  total_records: number;
  page: number;
  page_size: number;
  result: Result[];
}

export interface Result {
  id: number;
  ticket_number: string;
  modules: string;
  subject: string;
  description: string;
  status: number;
  comment: any;
  full_name: string;
  code: string;
  created_date: any;
  updated_date: any;
  created_user: any;
  updated_user: any;
  deleted_user: any;
}
@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  http = inject(HttpClient);
  ticketList = signal<Result[]>([]);
  searchTerm = '';
  pageNumber = signal(1);
  totalPages = signal(1);
  isLoading = signal(true);

  constructor() {}

  tableHeader = [
    '#',
    'Ticket Number',
    'Agent Code',
    'Description',
    'Status',
    'Comments',
    'Action',
  ];

  ngOnInit(): void {
    this.getTicketList();
  }
  getTicketList() {
    this.isLoading.set(true);
    let payload: any = {
      per_page: 15,
      page: this.pageNumber(),
      search: null,
      from_date: '2026-01-01',
      to_date: '2026-12-31',
      user_type: 'agent',
    };
    let params = new HttpParams();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });

    this.http.get<any>(`ticket-list?${params.toString()}`).subscribe({
      next: (res) => {
        this.totalPages.set(Math.ceil(res.data.total_records / 15));
        this.isLoading.set(false);
        this.ticketList.set(res.data.result);
        console.log(res);
      },
      error: (err) => {console.log(err);
        this.isLoading.set(false);
      },
    });
  }
  searchTickets() {
    console.log(this.searchTerm);
  }

  handlePageChange(page: number) {
    console.log('Page changed to:', page);
    this.pageNumber.set(page);
    this.getTicketList();
    // Handle page change logic here
  }
}
