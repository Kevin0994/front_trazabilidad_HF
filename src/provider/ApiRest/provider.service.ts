import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ProviderService {

  constructor(public http: HttpClient,) { 
    
  }

  loadCosecha(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosecha/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
