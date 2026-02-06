import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';

// Domain-specific Interfaces
export interface Lead {
  merchant_name: string;
  lead_code: string;
  lead_status: string;
  bank_name: string;
  address: string;
  business_name: string;
  phone_number: string;
  email: string;
  accepted_by: string;
  accepted_on: string;
  gender: string;
}

export interface Agent {
  agent_name: string;
  agent_email: string;
  agent_profile_photo: string;
  accepted_on: string;
  lead_status: string;
  tat_duration: string;
  time_elapsed: string;
  time_remaining: string;
}

export interface LeadDataResponse {
  lead: Lead;
  agent: Agent;
}

@Component({
  selector: 'app-lead-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-details.html',
  styleUrl: './lead-details.css',
})
export class LeadDetails implements OnInit {
  // Use a setter for Input if you want to trigger the API call as soon as the UUID is available
  @Input() lead_uuid!: string;

  private http = inject(HttpClient);

  // Signals for state
  leadData = signal<LeadDataResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed signals for easier template access
  lead = computed(() => this.leadData()?.lead);
  agent = computed(() => this.leadData()?.agent);

  ngOnInit(): void {
    if (this.lead_uuid) {
      this.getLeadDetails();
    } else {
      this.error.set('No Lead UUID provided.');
      this.isLoading.set(false);
    }
  }

  getLeadDetails(): void {
    this.isLoading.set(true);

    // Constructing URL with template literal for clarity
    const url = `leads/detail?leadUuId=${this.lead_uuid}`;

    this.http.post<{ data: LeadDataResponse }>(url, {}).subscribe({
      next: (res) => {
        this.leadData.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load lead details.');
        this.isLoading.set(false);
        console.error('Lead API Error:', err);
      },
    });
  }
}
