import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { CleanUrlPipe } from '../../../pipes/CleanUrlPipe';

export interface AgentAttendance {
  date: string;
  agent_code: string;
  full_name: string;
  contact_number: string;
  check_in_time: string;
  check_in_location: string;
  check_in_photo: string;
  attendance_status: string;
}

@Component({
  selector: 'app-agent-attendance',
  standalone: true,
  imports: [FormsModule, CommonModule, CleanUrlPipe],
  templateUrl: './agent-attendance.html',
  styleUrl: './agent-attendance.css',
})
export class AgentAttendanceComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);

  // ---------- STATE ----------
  isLoading = signal(false);
  pageNumber = signal(1);
  totalPages = signal(0);

  selectedDate = new Date().toISOString().split('T')[0];
  searchTerm = '';
  filterValue: string | null = null;

  agentList = signal<AgentAttendance[]>([]);

  searchText$ = new Subject<string>();
  private subscription?: Subscription;

  // ---------- STATIC DATA ----------
  readonly perPage = 15;

  filterOptions = [
    { label: 'All', value: null },
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
  ];

  tableHeader = [
    '#',
    'Agent Id',
    'Name',
    'Contact Number',
    'Check In Time',
    'Check In Location',
    'Check In Photo',
    'Attendance Status',
  ];

  // ---------- LIFECYCLE ----------
  ngOnInit(): void {
    this.fetchAgentAttendance();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // ---------- API CALL ----------
  fetchAgentAttendance(): void {
    this.isLoading.set(true);

    const params = this.buildQueryParams({
      date: this.selectedDate,
      city_id: '',
      attendance_status: this.filterValue,
      full_name: '',
      agent_code: '',
      contact_number: this.searchTerm,
      per_page: this.perPage,
      page: this.pageNumber(),
    });

    this.subscription = this.http.get<any>(`agent-attendance`, { params }).subscribe({
      next: (res) => {
        const data = res?.data;

        this.agentList.set(data?.result ?? []);
        this.totalPages.set(Math.ceil((data?.total_records ?? 0) / this.perPage));

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Agent attendance API error:', err);
        this.isLoading.set(false);
      },
    });
  }

  // ---------- HELPERS ----------
  private buildQueryParams(payload: Record<string, any>): HttpParams {
    let params = new HttpParams();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, String(value));
      }
    });

    return params;
  }

  // ---------- EVENTS ----------
  searchAgents(): void {
    this.searchText$.next(this.searchTerm);
    this.pageNumber.set(1);
    this.fetchAgentAttendance();
  }

  handleFilterChange(value: string | null): void {
    this.filterValue = value === 'null' ? null : value;
    this.pageNumber.set(1);
    this.fetchAgentAttendance();
  }

  handlePageChange(page: number): void {
    this.pageNumber.set(page);
    this.fetchAgentAttendance();
  }

  handleDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.pageNumber.set(1);
    this.fetchAgentAttendance();
  }
}
