import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request', JSON.stringify(req, null, 4));
  const authReq = req.clone({
   
  
  });
  return next(req);
};
