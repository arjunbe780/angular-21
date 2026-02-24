import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface LeadsDashboardResponse {
  success: boolean;
  message: string;
  summary_cards: LeadSummary;
  status_distribution: StatusItem[];
  completion_metrics: CompletionMetrics;
  lead_flow_trend: FlowTrend[];
  agent_workload: AgentWorkload[];
  clients: ClientData[];
  filters_applied: any;
  exclusive_acceptance_rate: number;
}

export interface LeadSummary {
  total_leads: number;
  active_leads: number;
  pending_leads: number;
  tat_breached: number;
  exclusive_notified: number;
  exclusive_accepted: number;
}

export interface StatusItem {
  status: string;
  count: number;
}

export interface CompletionMetrics {
  total_completed: number;
  on_time_completed: number;
  overdue_leads: number;
  approaching_deadline: number;
  avg_completion_minutes: number;
}

export interface FlowTrend {
  date: string;
  created: number;
  completed: number;
  cancelled: number;
}

export interface AgentWorkload {
  agent_id: number;
  agent_name: string;
  active_leads: number;
  avg_completion_time_hours: number;
}

export interface ClientData {
  client_id: number;
  client_name: string;
  total_leads: number;
  completed: number;
  in_progress: number;
  cancelled: number;
}
interface MonthOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-leads-dashboard',
  standalone: true, // Don't forget this!
  imports: [CommonModule, FormsModule],
  templateUrl: './leads-dashboard.html',
  styleUrl: './leads-dashboard.css',
  
})
export class LeadsDashboard implements OnInit {
  // Added 'implements OnInit'
  private http = inject(HttpClient);

  // 1. Fixed the type to match your response interface
  leadsData = signal<LeadsDashboardResponse | null>(null);
  months: MonthOption[] = [];
  selectedMonth: any = '';
  isLoading = signal(true);
  ngOnInit() {
    this.generateMonthList();
    this.loadDashboardData();
  }
  generateMonthList() {
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

      // Manual formatting: Month (1-indexed) and Year
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const formattedValue = `${year}-${month}`; // Results in "10-2025"

      this.months.push({
        label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
        value: formattedValue,
      });
    }
    console.log(JSON.stringify(this.months, null, 4));
    if (this.months.length > 0) {
      this.selectedMonth = this.months[0].value;
    }
  }
  loadDashboardData() {
    this.http
      .post<LeadsDashboardResponse>('leads/dashboard', {
        trend_period: 'month',
        month_filter: this.selectedMonth,
      })
      .subscribe({
        next: (res: any) => {
          // 2. Fixed 'status' to 'success'
          if (res.success) {
            // 3. Set the whole response as it matches the interface
            this.leadsData.set(res.data);
            this.isLoading.set(false);
          }
        },
        error: (err) => {
          console.error('Dashboard Error:', err);
          this.isLoading.set(false);
        },
      });
  }
  handleMonthChange(newValue: Date) {
    this.selectedMonth = newValue;
    this.isLoading.set(true);
    this.loadDashboardData();
  }
}
