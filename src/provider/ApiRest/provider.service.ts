import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class ProviderService {

  public status:any=false;
  public error:any;
  private API_URL = 'http://localhost:5001/hf-trazabilidad-89c0e/us-central1/app/';

  constructor(public http: HttpClient,) { }

  obtenerDocumentos(rutaDocumento:string) {
    return new Promise(resolve => {
      this.http.get(this.API_URL + rutaDocumento).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  obtenerDocumentosPorId(rutaDocumento:string, id:string) {
    return new Promise(resolve => {
      this.http.get(this.API_URL + rutaDocumento + id).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  InsertarDocumento(rutaDocumento, document:any){
    return new Promise(resolve => {
      this.http.post(this.API_URL + rutaDocumento, document).subscribe(data => {
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

  actualizarDocumento(rutaDocumento:string , id:string, document:any){
    return new Promise(resolve => {
      this.http.put(this.API_URL + rutaDocumento, document).subscribe(data => {
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

  eliminarDocumento(rutaDocumento:string, id:string):Observable<any>{
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: id,
    }
    return this.http.delete<any>(this.API_URL + rutaDocumento, Options)
  }

  loadHistorialCosecha(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaHistorial/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadCosechas(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechas/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadListaCosecha(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/listaCosechas/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BuscarCosecha(id:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaHistorial/documents/"+id;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BuscarStockCosecha(nombre:any,lote:any){
    var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaStock/"+nombre+"/"+lote;
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  InsertarCosecha(form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaHistorial/post"
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

  InsertarCosechaStock(form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechas/post"
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
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaHistorial/documents/"+id
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

  ActualizarCosechaStock(id:any,form:any){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechas/documents/"+id
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
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechaHistorial/documents/"+id;
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: id,
    }
    return this.http.delete<any>(api_url,Options)
  }

  EliminarCosechaStock(id:any):Observable<any>{
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/cosechas/documents/"+id;
    var Options = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      body: id,
    }
    return this.http.delete<any>(api_url,Options)
  }


  //

  // ValidarUsuario(email:any,password:any){
  //   var api_url="http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/usuario/"+email+"/"+password;
  //   return new Promise(resolve => {
  //     this.http.get(api_url).subscribe(data => {
  //       resolve(data);
  //     }, err => {
  //       console.log(err);
  //     });
  //   });
  // }

  validarUsuario(rutaDocumento:string, email:string, password:string){
    return new Promise(resolve => {
      this.http.get(this.API_URL + rutaDocumento + `/${email}/${password}`).subscribe(data => {
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

  loadCategoriaProducto(){
    var api_url="http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/categoriaProducto/documents";
    return new Promise(resolve => {
      this.http.get(api_url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
