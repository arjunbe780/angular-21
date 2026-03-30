import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NoData } from '../../../sharedComponent/no-data/no-data';

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

export interface NotifiedLeadsResponse {
  success: boolean;
  error: any;
  message: string;
  data: Data;
}

export interface Data {
  lead: Lead;
  agents: Agent[];
}

export interface Lead {
  lead_uuid: string;
  lead_code: string;
  lead_status: string;
  business_name: string;
}

export interface Agent {
  agent_uuid: string;
  full_name?: string;
  agent_code: string;
  agent_leave_status?: number;
  contact_number: string;
  lead_wave: number;
  notified_at: string;
  lead_count: number;
}

export interface LeadVerifiedDetails   {
  success: boolean
  error: any
  message: string
  data: LeadVerifiedData
}

export interface LeadVerifiedData {
  lead: LeadVerifiedLead
  agent: LeadVerifiedAgent
  dynamic_form: DynamicForm
  images: Image[]
}

export interface LeadVerifiedLead {
  lead_uuid: string
  lead_code: string
  lead_status: string
  business_name: string
  business_category: string
  verification_start_datetime: string
  verification_end_datetime: string
}

export interface LeadVerifiedAgent {
  agent_id: string
  full_name: string
  agent_code: string
  contact_number: string
  lead_wave: number
  notified_at: string
  lead_due_date: string
  lead_accepted_at: any
  lead_completed_at: string
  created_date: any
  updated_date: any
  created_user: any
  updated_user: any
  deleted_user: any
}

export interface DynamicForm {
  "Basic Information": BasicInformation[]
  "Contact And Profile": ContactAndProfile[]
  "Skills And Preferences": Preference[]
  "Documents And Work Details": Detail[]
}

export interface BasicInformation {
  label_name: string
  value: string
  element_type: string
}

export interface ContactAndProfile {
  label_name: string
  value: string
  element_type: string
}

export interface Preference {
  label_name: string
  value: any
  element_type: string
}

export interface Detail {
  label_name: string
  value: any
  element_type: string
}

export interface Image {
  name: string
  image: string
}


@Component({
  selector: 'app-lead-details',
  standalone: true,
  imports: [CommonModule, MatTabsModule,NoData],
  templateUrl: './lead-details.html',
  styleUrl: './lead-details.css',
})
export class LeadDetails implements OnInit {
  // Use a setter for Input if you want to trigger the API call as soon as the UUID is available
  @Input() lead_uuid!: string;

  private http = inject(HttpClient);

  // Signals for state
  leadData = signal<LeadDataResponse | null>(null);
  notifiedLeads = signal<NotifiedLeadsResponse | null>(null);
  leadVerifiedDetails = signal<LeadVerifiedDetails | null>(null);
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
  getNotifiedAgent(): void {
    this.isLoading.set(true);

    // Constructing URL with template literal for clarity
    const url = `leads/notified`;

    this.http
      .post<{ data: NotifiedLeadsResponse }>('leads/notified', {
        lead_uuid: this.lead_uuid,
      })
      .subscribe({
        next: (res: any) => {
          this.notifiedLeads.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load lead details.');
          this.isLoading.set(false);
          console.error('Lead API Error:', err);
        },
      });
  }

  getVerifiedDetails() {
    this.isLoading.set(true);
    const payload = {
      lead_uuid: this.lead_uuid,
    };
    this.http.post<{ data: LeadVerifiedDetails }>('leads/verifiedDetails', payload).subscribe({
      next: (res: any) => {
        this.leadVerifiedDetails.set(res);
        this.isLoading.set(false);
        console.log(res);
      },
      error: (err) => {
        this.error.set('Failed to load lead details.');
        this.isLoading.set(false);
        console.error('Lead API Error:', err);
      },
    });
  }

  formatValue(val: any): string {
    if (!val) return '—';
    try {
      // Check if it's a stringified array from the dynamic form
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed.join(', ') : parsed;
      }
    } catch (e) {
      return val;
    }
    return val;
  }

  onTabChange(event: any): void {
    if (event.index == 1) {
      this.getNotifiedAgent();
    }
    if (event.index == 0) {
      this.getLeadDetails();
    }
    if (event.index == 2) {
      this.getVerifiedDetails();
    }
  }
  notifySingleAgent(agent: any): void {
    console.log(agent);
    const payload = {
      lead_uuid: this.lead_uuid,
      notification_type: 'all',
      agent_uuid: agent.agent_uuid,
    };
    this.http.post('leads/reNotifyAgents', payload).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        this.error.set('Failed to load lead details.');
        this.isLoading.set(false);
        console.error('Lead API Error:', err);
      },
    });
    this.isLoading.set(true);
  }
  notifyAllAgents(): void {
    this.isLoading.set(true);
  }
}
