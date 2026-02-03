import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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

  menuItems: MenuItem[] = [
    { label: 'Home', route: '/home' },
    {
      label: 'Leads',
      children: [
        { label: 'Leads Dashboard', route: '/leads/dashboard' },
        { label: 'Leads List', route: 'leads/list' },
      ],
    },
    {
      label: 'Agent',
      children: [
        { label: 'Agent Dashboard', route: '/agent/dashboard' },
        { label: 'All Agents', route: '/agent/list' },
      ],
    },
    {
      label: 'Master',
      children: [
        { label: 'Feedback', route: '/master/feedback' },
        { label: 'Clients', route: '/master/clients' },
      ],
    },
  ];

  toggleMenu(label: string) {
    this.expandedMenu.update((current) => (current === label ? null : label));
  }
}
