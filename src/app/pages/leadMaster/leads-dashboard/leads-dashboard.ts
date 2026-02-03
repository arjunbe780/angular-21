import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
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
@Component({
  selector: 'app-leads-dashboard',
  standalone: true, // Don't forget this!
  imports: [], 
  templateUrl: './leads-dashboard.html',
  styleUrl: './leads-dashboard.css',
})
export class LeadsDashboard implements OnInit { // Added 'implements OnInit'
  private http = inject(HttpClient);

  // 1. Fixed the type to match your response interface
  leadsData = signal<LeadsDashboardResponse | null>(null);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.http
      .post<LeadsDashboardResponse>('http://13.202.146.57/api/v1/admin/leads/dashboard', {
        trend_period: 'month',
        month_filter: '2026-01',
        from_date: '2026-01-01',
        to_date: '2026-01-31',
      })
      .subscribe({
        next: (res:any) => {
          // 2. Fixed 'status' to 'success'
          if (res.success) {
            // 3. Set the whole response as it matches the interface
            this.leadsData.set(res);
          }
        },
        error: (err) => console.error('Dashboard Error:', err),
      });
  }
}
