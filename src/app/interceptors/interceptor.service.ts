import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private cookieService: CookieService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // throw new Error('Method not implemented.');
    let reqClone = req;
    const token = this.cookieService.get('token');
    if(token) {
      const headers = new HttpHeaders({
        'Authorization': token
      });
      reqClone = req.clone({headers})

    }
    
    
    return next.handle(reqClone).pipe(
      catchError(this.handleError)
    )
  }

  handleError(err: HttpErrorResponse) {
    console.log(err);
    return throwError(err);
  }
}
