import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inject Router here
  const baseUrl = environment.uatUri;
  const token = localStorage.getItem('token');

  let activeHeaders = req.headers.set('Authorization', `Bearer ${token}`);
  
  if (req.body instanceof FormData) {
    activeHeaders = activeHeaders.delete('Content-Type');
  } else if (!req.headers.has('Content-Type')) {
    activeHeaders = activeHeaders.set('Content-Type', 'application/json');
  }

  const apiReq = req.clone({
    url: `${baseUrl}${req.url}`,
    headers: activeHeaders
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear local storage if the token is invalid/expired
        localStorage.removeItem('token');
        
        // Redirect to login page
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};