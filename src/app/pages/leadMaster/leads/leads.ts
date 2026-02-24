import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// Define what a Lead looks like
export interface Lead {
  lead_uuid: string;
  lead_code: string;
  client_name: string;
  verification_status: any;
  lead_status: string;
  city_name: string;
  business_category_name: string;
  lead_pincode: string;
  merchant_address: string;
  landmark_address: string;
  created_date: string;
  updated_date: string;
  created_user: string;
  updated_user: string;
}

@Component({
  selector: 'app-leads',
  standalone: true, // Ensure this is here if not using NgModules
  imports: [CommonModule, RouterLink],
  templateUrl: './leads.html',
  styleUrl: './leads.css',
})
export class Leads implements OnInit {
  private http = inject(HttpClient);

  // Use the interface here for better autocomplete
  leadList = signal<Lead[]>([]);
  isLoading = signal(false); // Useful for showing a spinner
  pageNumber = signal(1);
  totalPages = signal(0);
  leadStatus = signal('');

  tableHeader = [
    '#',
    'Lead Code',
    'Category',
    'Status',
    'Client Name',
    'Location',
    'Created Date',
    'Action',
  ];

  filterOptions = [
    { label: 'All', value: '' },
    { label: 'Notified', value: 'notified' },
    { label: 'Completed', value: 'completed' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Rejected', value: 'rejected' },
  ];

  ngOnInit(): void {
    this.getAllLeads();
  }

  getAllLeads() {
    this.isLoading.set(true);

    const payload = {
      page: this.pageNumber(),
      per_page: 15,
      lead_status: this.leadStatus(),
    };

    this.http.post<any>('leads/allLeads', payload).subscribe({
      next: (res) => {
        // Based on your console.log(res.data.data)
        this.leadList.set(res.data.result);
        this.totalPages.set(res.data.last_page);
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
   
    this.getAllLeads();
  }
  handleOptionChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.leadStatus.set(value);
    this.isLoading.set(true);
     this.pageNumber.set(1);
    this.getAllLeads();
  }
}
