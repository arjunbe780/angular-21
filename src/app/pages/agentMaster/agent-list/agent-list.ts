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
  filterValue = null;

  filterOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Submitted', value: 1 },
    { label: 'Rejected', value: 2 },
    { label: 'Re-Submitted', value: 3 },
    { label: 'Active', value: 4 },
    { label: 'Blocked', value: 5 },
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
      status: this.filterValue,
      from_date: '2025-01-01',
      to_date: '2026-01-31',
      export: false,
      search: this.searchTerm,
    };
    let params = new HttpParams();

    // 2. Dynamically append keys from your payload
    // This loop handles any object you pass in
    // 0  pending
    // 1  Submitted
    // 2  Rejected
    // 3  Re-Submitted
    // 4  Active
    // 5  blocked

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    console.log(params.toString());
    this.http
      .get<any>(`agent-list?${params.toString()}`)
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

  handleOptionChange(newValue: any) {
    if (newValue === 'null' || newValue === null) {
      this.filterValue = null;
    } else {
      this.filterValue = newValue;
    }
    this.isLoading.set(true);
    this.pageNumber.set(1);
    this.getAgentList();
  }
  handlePageChange(page: number) {
    console.log('Page changed to:', page);
    this.pageNumber.set(page);
    this.getAgentList();
    // Handle page change logic here
  }
  searchAgents() {
    this.searchText$.next(this.searchTerm);
  }
}
