import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';

export interface LeadDataProps {
  lead: Lead;
  agent: Agent;
}

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

@Component({
  selector: 'app-lead-details',
  imports: [],
  templateUrl: './lead-details.html',
  styleUrl: './lead-details.css',
})
export class LeadDetails implements OnInit {
  @Input() lead_uuid!: string;
  http = inject(HttpClient);
  leadData = signal<LeadDataProps>({ lead: {} as Lead, agent: {} as Agent });
  isLoading = signal(true);
  ngOnInit(): void {
    console.log(this.lead_uuid);
    this.getLeadDetails();
  }

  getLeadDetails() {
    this.http
      .post('http://13.202.146.57/api/v1/admin/leads/detail?leadUuId=' + this.lead_uuid, {})
      .subscribe({
        next: (res: any) => {
          this.leadData.set(res.data);
          this.isLoading.set(false);
          console.log(res);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('API Error:', err);
        },
      });
  }
}
