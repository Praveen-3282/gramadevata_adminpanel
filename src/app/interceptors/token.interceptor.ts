import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// import { AuthenticationService } from '../services/authenticationservice/authentication.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  // Write the logic for addin api-token here
  const token = localStorage.getItem('token');
  const excludedUrlsForGetRequests = [
   
    '/api/templemain',
    '/api/goshalamain',
    '/api/eventmain',
    '/api/home',
    '/api/temple',
    '/api/templeCategory',
    '/api/templePriority',
    '/api/block',
    '/api/country',
    '/api/district',
    '/api/state',
    '/api/village',
    '/api/goshala',
    '/api/goshalaCategory',
    '/api/event',
    '/api/eventCategory',
    '/api/eventCategory',
    '/api/eventCategory'
  ];

  const excludedUrlsForPost = [
    '/api/token/refresh',
    '/api/register',
    '/api/verify',
    '/api/resend',
    '/api/login',
    '/api/forgot-password',
    '/api/verify-forgot-password',
  ];

  const excludedUrls = req.method == 'GET' ? excludedUrlsForGetRequests : excludedUrlsForPost;

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  if (token) {
    try {
      let decodeToken = jwtDecode(token);
      const isExpired =
        decodeToken && decodeToken.exp
          ? decodeToken.exp < Date.now() / 1000
          : false;
      if (isExpired) {
        let refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          return authenticationService.refreshToken(refreshToken).pipe(
            switchMap((res) => {
              // localStorage.setItem('token', res['access']);
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              return next(req);
            }),
            catchError(err => {
              authenticationService.logout()
              throw err;
            })
          );
        } else {
          authenticationService.logout();
        }
      } 
      else {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next(req);
      }
    } catch (e) {
      authenticationService.logout()
    }
  }
  return next(req);
};
