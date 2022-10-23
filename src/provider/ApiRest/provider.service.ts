import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable()
export class ProviderService {
  public status: any = false;
  public error: any;
  //private API_URL =
  //  'http://localhost:5000/hf-trazabilidad-89c0e/us-central1/app/';
  private API_URL =
    'https://shaggy-lands-run-179-49-30-3.loca.lt/hf-trazabilidad-89c0e/us-central1/app/';

  constructor(public http: HttpClient) {}

  obtenerDocumentos(rutaDocumento: string) {
    return new Promise((resolve) => {
      this.http.get(this.API_URL + rutaDocumento).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  obtenerDocumentosPorId(rutaDocumento: string, id: string) {
    console.log(this.API_URL + rutaDocumento + id);
    return new Promise((resolve) => {
      this.http.get(this.API_URL + rutaDocumento + id).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  InsertarDocumento(rutaDocumento, document: any) {
    return new Promise((resolve) => {
      this.http.post(this.API_URL + rutaDocumento, document).subscribe(
        (data) => {
          resolve(data);
          return (this.status = true);
        },
        (err) => {
          this.status = false;
          resolve(err);
        }
      ).closed;
    });
  }

  actualizarDocumento(rutaDocumento: string, id: string, document: any) {
    return new Promise((resolve) => {
      this.http.put(this.API_URL + rutaDocumento + id, document).subscribe(
        (data) => {
          resolve(data);
          return (this.status = true);
        },
        (err) => {
          this.status = false;
          resolve(err);
        }
      ).closed;
    });
  }

  eliminarDocumento(rutaDocumento: string, id: string): Observable<any> {
    var Options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
      body: id,
    };
    return this.http.delete<any>(this.API_URL + rutaDocumento + id, Options);
  }

  InsertarCosecha(
    rutaDocumento: string,
    nombre: any,
    lote: any,
    document: any
  ) {
    console.log(this.API_URL + rutaDocumento + nombre + lote);
    return new Promise((resolve) => {
      this.http
        .post(this.API_URL + rutaDocumento + nombre + '/' + lote, document)
        .subscribe(
          (data) => {
            resolve(data);
            return (this.status = true);
          },
          (err) => {
            this.status = false;
            resolve(err);
          }
        ).closed;
    });
  }

  ActualizarCosechaHistorial(rutaDocumento, id: string, document: any) {
    return new Promise((resolve) => {
      this.http.post(this.API_URL + rutaDocumento + id, document).subscribe(
        (data) => {
          resolve(data);
          return (this.status = true);
        },
        (err) => {
          this.status = false;
          resolve(err);
        }
      ).closed;
    });
  }

  validarUsuario(rutaDocumento: string, email: string, password: string) {
    return new Promise((resolve) => {
      this.http
        .get(this.API_URL + rutaDocumento + `/${email}/${password}`)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

}
