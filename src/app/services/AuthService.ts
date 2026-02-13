import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthService {
  // In a real app, you'd decode this from a JWT token
  getUserRole(): string {
    return localStorage.getItem('role') || 'guest';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}