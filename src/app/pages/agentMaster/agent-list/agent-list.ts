import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

export interface AgentListProps {
  uuid?: string;
  agent_code?: string;
  full_name?: any;
  contact_number?: string;
  status?: number;
  current_city_name?: any;
  current_state_name?: any;
  created_at_formatted?: string;
}

@Component({
  selector: 'app-agent-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList implements OnInit, OnDestroy {
  isLoading = signal(false); // Useful for showing a spinner
  pageNumber = signal(1);
  totalPages = signal(0);
  searchTerm = '';
  http = inject(HttpClient);
  agentList = signal<AgentListProps[]>([]);
  searchText$ = new Subject<string>();
  private subscription!: Subscription;

  filterOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 1 },
    { label: 'Approved', value: 4 },
  ];

  tableHeader = ['#', 'Agent Id', 'Name', 'Status', 'City', 'Created Date', 'Action'];

  ngOnInit(): void {
    this.getAgentList();
    this.subscription = this.searchText$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.getAgentList();
        console.log('Debounced search value:', value);
        // Perform actions
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  getAgentList() {
    this.isLoading.set(true);

    let payload: any = {
      per_page: 15,
      page: this.pageNumber(),
      status: null,
      from_date: '2025-01-01',
      to_date: '2026-01-31',
      export: false,
      search: this.searchTerm,
    };
    let params = new HttpParams();

    // 2. Dynamically append keys from your payload
    // This loop handles any object you pass in
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== null && payload[key] !== undefined) {
        params = params.append(key, payload[key].toString());
      }
    });
    console.log(params.toString());
    this.http
      .get<any>(`http://13.202.146.57/api/v1/admin/agent-list?${params.toString()}`)
      .subscribe({
        next: (res) => {
          // Based on your console.log(res.data.data)
          this.agentList.set(res.data.result);
          let total = Math.ceil(res.data.total_records / 15);
          this.totalPages.set(total);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isLoading.set(false);
        },
      });
  }

  handleOptionChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    // Handle option change logic here
  }
  handlePageChange(page: number) {
    this.pageNumber.set(page);
    this.isLoading.set(true);
    this.getAgentList();
    // Handle page change logic here
  }
  searchAgents() {
    this.searchText$.next(this.searchTerm);
  }
}
