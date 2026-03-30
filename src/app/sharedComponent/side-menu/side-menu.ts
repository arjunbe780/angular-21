import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface MenuItem {
  label: string;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css',
})
export class SideMenu {
  expandedMenu = signal<string | null>(null);
  route = inject(Router);
  menuItems: MenuItem[] = [
    { label: 'Home', route: '/home' },
    {
      label: 'Leads',
      children: [
        { label: 'Leads Dashboard', route: '/leads/dashboard' },
        { label: 'Leads List', route: 'leads/list' },
        { label: 'Leads Create', route: 'leads/create' },
      ],
    },
    {
      label: 'Agent',
      children: [
        { label: 'Agent Dashboard', route: '/agent/dashboard' },
        { label: 'All Agents', route: '/agent/list' },
        { label: 'Attendance', route: '/agent/attendance' },
      ],
    },
    {
      label: 'Verification Forms',
      children: [{ label: 'Form Dashboard', route: '/form/category' }],
    },
    {
      label: 'Master',
      children: [
        { label: 'Feedback', route: '/master/feedback' },
        { label: 'Clients', route: '/master/clients' },
      ],
    },
    {
      label: 'Tickets',
      children: [
        { label: 'Ticket Dashboard', route: '/ticket/dashboard' },
        { label: 'Ticket List', route: '/ticket/list' },
      ],
    },
  ];

  toggleMenu(label: string) {
    this.expandedMenu.update((current) => (current === label ? null : label));
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
