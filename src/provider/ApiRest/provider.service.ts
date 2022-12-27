import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProviderMensajes } from '../modalMensaje/providerMessege.service';

@Injectable()
export class ProviderService {
  public status: any = false;
  public error: any;
  private API_URL =
    'http://127.0.0.1:5000/hf-trazabilidad-89c0e/us-central1/app/';

  constructor(private providerMensajes:ProviderMensajes,
    public http: HttpClient) {}

  obtenerDocumentos(rutaDocumento: string) {
    return new Promise((resolve) => {
      this.http.get(this.API_URL + rutaDocumento).subscribe(
        (data) => {
          resolve(data);
          return (this.status = true);
        },
        (err) => {
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          console.log(err);
          return this.status = false;
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
          this.providerMensajes.dismissLoading();
          this.providerMensajes.ErrorMensajeServidor();
          resolve(err);
          return this.status = false;
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

  calcularLote(){
    let mes= (new Date().getMonth() + 1).toString();
    let dia= (new Date().getDate()).toString();

    if(mes.length < 2){
      mes = '0' + mes
    }

    if(dia.length < 2){
      dia = '0' + dia
    }

    let loteCalculado = mes + dia;

    return parseInt(loteCalculado);
  }
}
