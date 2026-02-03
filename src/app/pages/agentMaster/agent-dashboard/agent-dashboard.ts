import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardData {
  cards: DashboardCards;
  status_distribution: StatusDistribution;
  registration_trend: RegistrationTrend;
  last_pending_users: PendingUser[];
  geographical_agent_users: GeoLocation[];
  agents_ranking: AgentRanking[];
}

export interface DashboardCards {
  total_users: number;
  pending_approval: number;
  today_signups: number;
}

export interface StatusDistribution {
  approved: number;
  rejected: number;
}

export interface RegistrationTrend {
  chart_data: ChartPoint[];
}

export interface ChartPoint {
  label: string;
  approved_count: string; // Note: API sends this as a string
  pending_count: string;
}

export interface PendingUser {
  uuid: string;
  agent_code: string;
  full_name: string | null;
  contact_number: string;
  status: number;
}

export interface GeoLocation {
  city_name: string;
  state_name: string;
  total_users: number;
  total_completed_leads: string;
}

export interface AgentRanking {
  agent_code: string;
  full_name: string;
  total_completed_leads: number;
}

@Component({
  selector: 'app-agent-dashboard',
  imports: [],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard implements OnInit {
  private http = inject(HttpClient);

  // Initialize with null or a default object
  dashboardData = signal<DashboardData | null>(null);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.http.get<DashboardResponse>('http://13.202.146.57/api/v1/admin/agent/dashboard?from_date=2025-01-01&to_date=2026-01-27').subscribe({
      next: (res) => {
        if (res.status) {
          this.dashboardData.set(res.data);
        }
      },
      error: (err) => console.error('Dashboard Error:', err),
    });
  }
}
