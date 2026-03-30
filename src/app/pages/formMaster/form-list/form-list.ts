import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Root {
  id: number;
  section_name: string;
  form_slug: string;
  business_category_id: number;
  is_client_specific: number;
  specific_clients: number[];
  form_specific_states: number[];
  form_specific_cities: number[];
  order_sequence: number;
  form_section_status: number;
  business_category_name: string;
  status_label: string;
  created_date: string;
  updated_date: string;
  created_user: string;
  updated_user: any;
  deleted_user: any;
  specific_clients_data: SpecificClientsDaum[];
  form_specific_states_data: FormSpecificStatesDaum[];
  form_specific_cities_data: FormSpecificCitiesDaum[];
  created_by: CreatedBy;
}

export interface SpecificClientsDaum {
  id: number;
  client_name: string;
  created_date: any;
  updated_date: any;
  created_user: any;
  updated_user: any;
  deleted_user: any;
}

export interface FormSpecificStatesDaum {
  id: number;
  state_name: string;
  created_date: any;
  updated_date: any;
  created_user: any;
  updated_user: any;
  deleted_user: any;
}

export interface FormSpecificCitiesDaum {
  id: number;
  city_name: string;
  created_date: any;
  updated_date: any;
  created_user: any;
  updated_user: any;
  deleted_user: any;
}

export interface CreatedBy {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  phone_verified_at: string;
  gender: string;
  date_of_birth: string;
  is_active: number;
  is_protected: number;
  client_id: number;
  user_type: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  full_name: string;
}

@Component({
  selector: 'app-form-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './form-list.html',
  styleUrl: './form-list.css',
})
export class FormList {
  private http = inject(HttpClient);
  @Input() id!: string;
  // Use the interface here for better autocomplete
  leadList = signal<Root[]>([]);
  isLoading = signal(false); // Useful for showing a spinner
  pageNumber = signal(1);
  totalPages = signal(0);
  leadStatus = signal('');
  tableHeader = ['#', 'Form Nmae', 'Cities', 'Clients', 'Last Updated', 'Status', 'Action'];

  ngOnInit(): void {
    this.getAllLeads();
  }

  getAllLeads() {
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
    this.http.get<any>(`builders-form-sections/list?business_category_id=${this.id}`).subscribe({
      next: (res) => {
        // Based on your console.log(res.data.data)
        this.leadList.set(res.data);
        this.totalPages.set(Math.ceil(res.data.total_records / 15));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading.set(false);
      },
    });
  }
}
