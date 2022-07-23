import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ProviderService {

  public status:any=false;
  public error:any;

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

  BuscarCosecha(id:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/cosecha/documents/"+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  InsertarCosecha(form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosecha/post"
    return new Promise(resolve => {
      this.http.post(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  ActualizarCosecha(id:any,form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosecha/documents/"+id
    return new Promise(resolve => {
      this.http.put(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  EliminarCosecha(id:any):Observable<any>{
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosecha/documents/"+id;
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: id,
    }
    return this.http.delete<any>(api_url,Options)
  }

  ValidarUsuario(email:any,password:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/"+email+"/"+password;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BuscarUsuario(id:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/"+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BuscarRolUsuario(id:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/documents/rol/"+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadUsuarios(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/usuarios/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  InsertarUsuario(form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/post"
    return new Promise(resolve => {
      this.http.post(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  ActualizarUsuario(id:any,form:any){
    console.log(form);
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/documents/"+id
    return new Promise(resolve => {
      this.http.put(api_url,form).subscribe(data => {
        resolve(data);
        return this.status=true;
      }, err => {
        this.status=false;
        resolve(err);
        if(err.status == 400){
          return this.error=400
        }else{
          return this.error=0
        }
      }).closed;
    });
  }

  EliminarUsuario(id:any):Observable<any>{
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/documents/"+id;
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: id,
    }
    return this.http.delete<any>(api_url,Options)
  }

}
