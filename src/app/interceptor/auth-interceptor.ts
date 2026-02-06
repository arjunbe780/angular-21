import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl;
  const apiReq = req.clone({
    url: `${baseUrl}${req.url}`,
    setHeaders: {
      Headers: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  console.log('Request', JSON.stringify(apiReq, null, 4));
  return next(apiReq);
};
