import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MonthOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-ticket-dashboard',
  imports: [CommonModule, KeyValuePipe, FormsModule],
  templateUrl: './ticket-dashboard.html',
  styleUrl: './ticket-dashboard.css',
})
export class TicketDashboard implements OnInit {
  months: MonthOption[] = [];
  selectedMonth: any = '';
  data = {
    cards: {
      total_tickets: 500,
      open_tickets: 120,
      sla_breached: 15,
      resolved: 365,
    },
    status_counts: {
      created: 45,
      'In progress': 120,
      'closed resolve': 300,
      'closed unresolve': 35,
    },
    recent_tickets: [
      {
        id: 101,
        ticket_number: 'TICK-8829',
        subject: 'Login Issue',
        status: 1,
        agent_code: 'AGNT-007',
      },
    ],
    city_analytics: [
      {
        city_name: 'New York',
        open_tickets: 12,
        sla_compliance: '95.5%',
        avg_response: '4.5 hrs',
      },
    ],
  };

  ngOnInit(): void {
    this.generateMonthList();
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
  handleMonthChange(newValue: Date) {
    this.selectedMonth = newValue;
  }

  public dashboardData = signal<any>({
    cards: { total_tickets: 8, open_tickets: 5, sla_breached: 1, resolved_tickets: 2 },
    analytics: { created: 1, 'In progress': 5, 'closed resolve': 2, 'closed unresolve': 0 },
    recent_tickets: [
      {
        id: 242,
        ticket_number: 'PIN-00242',
        subject: 'Pincode Request',
        description: 'Locality coverage',
        status: 1,
        agent_code: 'AD000014',
        module_name: 'Pincode',
      },
      {
        id: 241,
        ticket_number: 'PIN-00241',
        subject: 'Pincode Request',
        description: 'Locality coverage',
        status: 2,
        agent_code: 'AD000014',
        module_name: 'Pincode',
      },
      {
        id: 33,
        ticket_number: 'PIN-00033',
        subject: 'Pincode Request',
        description: 'Locality coverage',
        status: 2,
        agent_code: 'AD000013',
        module_name: 'Pincode',
      },
      {
        id: 32,
        ticket_number: 'PIN-00032',
        subject: 'Pincode Request',
        description: 'Transport issues',
        status: 1,
        agent_code: 'LD000999',
        module_name: 'Pincode',
      },
      {
        id: 31,
        ticket_number: 'PIN-00031',
        subject: 'Pincode Request',
        description: 'Pagination check',
        status: 1,
        agent_code: 'AD000013',
        module_name: 'Pincode',
      },
      {
        id: 30,
        ticket_number: 'PIN-00030',
        subject: 'Service Area Request',
        description: 'Accessibility',
        status: 1,
        agent_code: 'LD000888',
        module_name: 'Pincode',
      },
      {
        id: 29,
        ticket_number: 'PIN-00029',
        subject: 'Service Area Request',
        description: 'In APP CHECK',
        status: 0,
        agent_code: 'AD000013',
        module_name: 'Pincode',
      },
      {
        id: 28,
        ticket_number: 'PIN-00028',
        subject: 'Service Area Request',
        description: 'Notification Check',
        status: 1,
        agent_code: 'AD000013',
        module_name: 'Pincode',
      },
    ],
    city_analytics: [
      {
        city_name: 'Chennai',
        open_tickets: 5,
        sla_compliance: '87.50%',
        avg_response: '0.0 hrs',
      },
    ],
    ticket_trend: {
      chart_data: [
        { label: 'Sat', created_count: 2, closed_count: 0 },
        { label: 'Sun', created_count: 1, closed_count: 0 },
        { label: 'Mon', created_count: 1, closed_count: 0 },
        { label: 'Tue', created_count: 2, closed_count: 2 },
        { label: 'Wed', created_count: 1, closed_count: 0 },
      ],
    },
  });

  // Filter State
  public viewMode = signal<'agent' | 'lead'>('agent');

  // Computed signal for the filter logic
  public filteredTickets = computed(() => {
    const allTickets = this.dashboardData().recent_tickets;
    const mode = this.viewMode();
    // Assuming codes starting with 'AD' are Agents and others (like 'LD') are Leads
    return allTickets.filter((t: any) =>
      mode === 'agent' ? t.agent_code.startsWith('AD') : t.agent_code.startsWith('LD'),
    );
  });

  public cityData = computed(() => this.dashboardData().city_analytics[0]);

  // UI Helpers
  getStatusLabel(status: number): string {
    const labels: Record<number, string> = { 0: 'Open', 1: 'In Progress', 2: 'Resolved' };
    return labels[status] || 'New';
  }

  getStatusStyles(status: number): string {
    const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ';
    if (status === 0) return base + 'bg-blue-100 text-blue-600';
    if (status === 1) return base + 'bg-orange-100 text-orange-600';
    return base + 'bg-green-100 text-green-600';
  }
}
