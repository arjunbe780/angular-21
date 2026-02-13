import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  reverted: number;
  submitted: number;
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
interface MonthOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-agent-dashboard',
  imports: [FormsModule],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard implements OnInit {
  private http = inject(HttpClient);

  // Initialize with null or a default object
  dashboardData = signal<DashboardData | null>(null);
  months: MonthOption[] = [];
  selectedMonth: any = '';
  isLoading = signal(false);

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
      const formattedValue = `${month}-${year}`; // Results in "10-2025"

      this.months.push({
        label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
        value: formattedValue,
      });
    }
    if (this.months.length > 0) {
      this.selectedMonth = this.months[0].value;
    }
  }
  loadDashboardData() {
    this.isLoading.set(true);
    this.http.get<DashboardResponse>(`agent/dashboard?month_year=${this.selectedMonth}`).subscribe({
      next: (res) => {
        if (res.status) {
          this.dashboardData.set(res.data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
  handleMonthChange(newValue: Date) {
    this.selectedMonth = newValue;
    this.loadDashboardData();
  }
}
