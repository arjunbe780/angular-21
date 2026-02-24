import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  imports: [CleanUrlPipe, CommonModule, FormsModule],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
})
export class AgentDetails implements OnInit {
  @Input() uuid!: string;

  private http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);

  // State Management
  data = signal<AgentDetailsProps | null>(null);
  isLoading = signal(true);
  isOpen = false; // Modal visibility

  // Rejection Configuration

  ngOnInit(): void {
    this.getAgentDetails();
  }

  getAgentDetails(): void {
    this.isLoading.set(true);
    this.http.get<{ data: AgentDetailsProps }>(`agent-details?uuid=${this.uuid}`).subscribe({
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

  /* --- Action Logic --- */

  onApprove(): void {
    const payload = {
      uuid: this.uuid,
      action: 'approve',
      remarks_approve: ['bank_details_approved', 'personal_details_approved', 'kyc_approved'],
      remark_values: ['bank_details_rejected', 'personal_details_rejected'],
      reasons: 'Documents verified and approved',
    };

    this.http.post<any>('agent/update-status', payload).subscribe({
      next: () => {
        this.getAgentDetails();
        this._snackBar.open('Agent Approved Successfully', 'Close', { duration: 3000 });
      },
      error: (err) => console.error('API Error:', err),
    });
  }
  categories = [
    {
      category: 'personal_details',
      title: 'Personal Details',
      items: [
        { key: 'full_name', label: 'Full Name not matched' },
        { key: 'father_name', label: 'Father Name not matched' },
        { key: 'gender', label: 'Gender not matched' },
        { key: 'dob', label: 'Date of birth not matched' },
        { key: 'email', label: 'Email ID not matched' },
        { key: 'emergency_contact_number', label: 'Contact number not matched' },
        { key: 'permanent_city', label: 'Permanent city not matched' },
        { key: 'permanent_state', label: 'Permanent state not matched' },
        { key: 'permanent_pincode', label: 'Permanent pincode not matched' },
        { key: 'permanent_address', label: 'Permanent address not matched' },
        { key: 'permanent_landmark', label: 'Permanent landmark not matched' },
        { key: 'current_city', label: 'Current city not matched' },
        { key: 'current_state', label: 'Current state not matched' },
        { key: 'current_pincode', label: 'Current pincode not matched' },
        { key: 'current_address', label: 'Current address not matched' },
        { key: 'current_landmark', label: 'Current landmark not matched' },
        { key: 'profile_photo', label: 'Profile image not clear' },
      ],
    },
    {
      category: 'kyc_details',
      title: 'KYC Details',
      items: [
        { key: 'aadhaar_front_url', label: 'Aadhaar front image not clear' },
        { key: 'aadhaar_back_url', label: 'Aadhaar back image not clear' },
        { key: 'aadhaar_number', label: 'Aadhaar number not matched' },
        { key: 'additional_document_image', label: 'Additional document image not clear' },
        { key: 'additional_document', label: 'Additional document not matched' },
        { key: 'additional_document_number', label: 'Additional document number not matched' },
      ],
    },
    {
      category: 'bank_details',
      title: 'Bank Details',
      items: [
        { key: 'account_holder_name', label: 'Account holder name not matched' },
        { key: 'account_number', label: 'Account number not matched' },
        { key: 'ifsc_code', label: 'IFSC not matched' },
      ],
    },
  ];

  // ============================
  // SELECTED STORAGE
  // ============================
  selectedReasons: Record<string, string[]> = {};

  // ============================
  // CHECKBOX CHANGE
  // ============================
  onCheckboxChange(category: string, key: string, event: any) {
    if (!this.selectedReasons[category]) {
      this.selectedReasons[category] = [];
    }

    if (event.target.checked) {
      this.selectedReasons[category].push(key);
    } else {
      this.selectedReasons[category] = this.selectedReasons[category].filter((k) => k !== key);

      if (this.selectedReasons[category].length === 0) {
        delete this.selectedReasons[category];
      }
    }

    console.log('Selected:', this.selectedReasons);
  }

  // ============================
  // STAGE MAPPING
  // ============================
  getStageFromKey(category: string, key: string): string {
    if (key === 'profile_photo') return 'profile_photo_rejected';
    if (key === 'aadhaar_front_url') return 'aadhaar_front_rejected';
    if (key === 'aadhaar_back_url') return 'aadhaar_back_rejected';
    if (key === 'additional_document_image') return 'additional_document_rejected';

    if (category === 'bank_details') return 'bank_details_rejected';
    if (category === 'personal_details') return 'personal_details_rejected';
    if (category === 'kyc_details') return 'aadhaar_details_rejected';

    return `${category}_rejected`;
  }

  // ============================
  // BUILD PAYLOAD
  // ============================
  buildPayload() {
    const remarks_revert: string[] = [];
    const remark_values: any = {};

    Object.entries(this.selectedReasons).forEach(([category, keys]) => {
      remark_values[category] = {};

      keys.forEach((key: string) => {
        const stage = this.getStageFromKey(category, key);

        if (!remarks_revert.includes(stage)) {
          remarks_revert.push(stage);
        }

        const item = this.categories
          .find((c) => c.category === category)
          ?.items.find((i) => i.key === key);

        if (item) {
          remark_values[category][key] = item.label;
        }
      });
    });

    const payload = {
      uuid: this.uuid,
      action: 'revert',
      remarks_approve: [],
      remarks_revert,
      remark_values,
      reasons: this.buildReasonString(remark_values),
    };

    console.log('FINAL PAYLOAD:', JSON.stringify(payload, null, 2));
    return payload;
  }

  buildReasonString(values: any): string {
    return Object.keys(values)
      .map((cat) => `${cat}: ${Object.keys(values[cat]).join(', ')}`)
      .join(' | ');
  }

  hasSelection() {
    const allSelected = Object.values(this.selectedReasons).flat();
    let final = {
      count: allSelected.length,
      disabled: allSelected.length > 0 ? true : false,
    };
    return final;
  }

  submit(): void {
    this.buildPayload()
    // this.http.post<any>('agent/update-status', this.buildPayload()).subscribe({
    //   next: () => {
    //     this.isOpen = false;
    //     this.selectedReasons = {};
    //     this.getAgentDetails();
    //     this._snackBar.open('Agent Reverted Successfully', 'Close', { duration: 3000 });
    //   },
    //   error: (err) => {
    //     console.error('API Error:', err);
    //     this._snackBar.open('Error submitting rejection', 'Close', { duration: 3000 });
    //   },
    // });
  }
}
