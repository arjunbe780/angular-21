import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../services/AuthService';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appHasRole(allowedRoles: string | string[]) {
    const userRole = this.authService.getUserRole();
    
    // Normalize input to an array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (roles.includes(userRole)) {
      // Role matches: Render the element
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // No match: Clear the element from the DOM
      this.viewContainer.clear();
    }
  }
}