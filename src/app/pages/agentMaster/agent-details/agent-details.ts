import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CleanUrlPipe } from '../../../pipes/CleanUrlPipe';

/* ===================== INTERFACES ===================== */

export interface AgentDetailsProps {
  personal_details: PersonalDetails | null;
  bank_details: BankDetails | null;
  documents: Documents | null;
  status: number | null;
  profile_created_date: string | null;
  submitted_date: string | null;
  approved_date: string | null;
  reverted_date: string | null;
  pincodes: Pincode[] | null;
  agentPincode: any[];
  profile_summary: ProfileSummary | null;
  performance_data: PerformanceData | null;
  last_five_accepted: any[];
}

export interface PersonalDetails {
  uuid: string;
  agent_code: string;
  name: string;
  contact_number: string;
  email: string;
  emergency_contact_number: string;
  dob: string;
  gender: string;
  profile_photo: string | null;
  address: string;
  city: string;
  landmark: string;
  state: string;
  pincode: string;
  current_address: string;
  current_city: string;
  current_landmark: string;
  current_state: string;
  current_pincode: string;
}

export interface BankDetails {
  account_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface Documents {
  aadhaar_name: string | null;
  aadhaar_father_name: string | null;
  aadhaar_dob: string | null;
  aadhaar_card_number: string | null;
  aadhaar_front: string;
  aadhaar_back: string;
  additional_document_number: string;
  additional_document_type: string;
  additional_document_image: string;
}

export interface Pincode {
  pincode: string;
  created_date: string | null;
  updated_date: string | null;
  created_user: any;
  updated_user: any;
  deleted_user: any;
}

export interface ProfileSummary {
  first_job_accepted: any;
  last_job_accepted: any;
  profile_created_date: string | null;
  submitted_date: string;
  approved_date: string;
  reverted_date: string | null;
}

export interface PerformanceData {
  leads_accepted: number;
}

/* ===================== COMPONENT ===================== */

@Component({
  selector: 'app-agent-details',
  standalone: true,
  imports: [CleanUrlPipe],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
})
export class AgentDetails implements OnInit {
  @Input() uuid!: string;

  private http = inject(HttpClient);

  data = signal<AgentDetailsProps | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getAgentDetails();
  }

  getAgentDetails(): void {
    this.http
      .get<{
        data: AgentDetailsProps;
      }>(`agent-details?uuid=${this.uuid}`)
      .subscribe({
        next: (res) => {
          this.data.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('API Error:', err);
        },
      });
  }

  onApprove(): void {
    // TODO: approve API
  }

  onRevert(): void {
    // TODO: revert API
  }
}
