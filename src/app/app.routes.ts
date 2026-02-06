import { Routes } from '@angular/router';
import { Clients } from './pages/adminMaster/clients/clients';
import { Feedback } from './pages/adminMaster/feedback/feedback';
import { AgentDashboard } from './pages/agentMaster/agent-dashboard/agent-dashboard';
import { AgentDetails } from './pages/agentMaster/agent-details/agent-details';
import { AgentList } from './pages/agentMaster/agent-list/agent-list';
import { Home } from './pages/home/home';
import { LeadDetails } from './pages/leadMaster/lead-details/lead-details';
import { LeadsDashboard } from './pages/leadMaster/leads-dashboard/leads-dashboard';
import { Leads } from './pages/leadMaster/leads/leads';
import { Login } from './pages/login/login';
import { SignIn } from './pages/sign-in/sign-in';
import { TicketDashboard } from './pages/tickets/ticket-dashboard/ticket-dashboard';
import { TicketDetails } from './pages/tickets/ticket-details/ticket-details';
import { TicketList } from './pages/tickets/ticket-list/ticket-list';
import { SideMenu } from './sharedComponent/side-menu/side-menu';

export const routes: Routes = [
  // 1. Public Routes (No Sidebar)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'sign-in', component: SignIn }, // Fixed typo 'sing-in'

  // 2. Dashboard Routes (With Sidebar)
  // If Home is your main layout containing the sidebar:
  {
    path: '',
    component: SideMenu,
    // canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      {
        path: 'leads/list',
        component: Leads,
      },
      {
        path: 'leads/dashboard',
        component: LeadsDashboard,
      },
      {
        path: 'agent/list',
        component: AgentList,
      },
      {
        path: 'agent/dashboard',
        component: AgentDashboard,
      },
      {
        path: 'master/feedback',
        component: Feedback,
      },
      {
        path: 'master/clients',
        component: Clients,
      },
      {
        path: 'ticket/dashboard',
        component: TicketDashboard,
      },
      {
        path: 'ticket/list',
        component: TicketList,
      },
      { path: 'leads/:lead_uuid', component: LeadDetails },
      { path: 'agent/:uuid', component: AgentDetails },
      { path: 'ticket/:id', component: TicketDetails },
      // You can add 'agent' and 'master' routes here later
    ],
  },
];
