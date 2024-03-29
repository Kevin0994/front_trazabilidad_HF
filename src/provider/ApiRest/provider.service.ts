import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Observable } from 'rxjs';
import { ProviderMensajes } from '../modalMensaje/providerMessege.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';

const EXCEL_EXT = '.xlsx';

@Injectable()
export class ProviderService {
  public status: any = false;
  public error: any;
  private API_URL =
    'https://us-central1-hf-trazabilidad-89c0e.cloudfunctions.net/app/';
  //'https://us-central1-hf-trazabilidad-89c0e.cloudfunctions.net/app/';

  constructor(
    private androidPermissions: AndroidPermissions,
    private providerMensajes: ProviderMensajes,
    public http: HttpClient
  ) {}

  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const exelBuffer: any = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'array',
    });
    // call method buffer and filename
    this.saveAsExcel(exelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXT
    );
  }

  obtenerDocumentos(rutaDocumento: string) {
    return new Promise((resolve) => {
      this.http.get(this.API_URL + rutaDocumento).subscribe(
        (data) => {
          resolve(data);
          return (this.status = true);
        },
        (err) => {
          let response = err as any;
          this.providerMensajes.dismissLoading();
          if (response.error.msg != undefined) {
            this.providerMensajes.ErrorMensajePersonalizado(response.error.msg);
          } else {
            this.providerMensajes.ErrorMensajeServidor();
          }
          console.log(err);
          return (this.status = false);
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
          return (this.status = false);
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

  calcularLote() {
    let mes = (new Date().getMonth() + 1).toString();
    let dia = new Date().getDate().toString();

    if (mes.length < 2) {
      mes = '0' + mes;
    }

    if (dia.length < 2) {
      dia = '0' + dia;
    }

    let loteCalculado = mes + dia;

    return parseInt(loteCalculado);
  }

  validarIdIngreso(rutaDocumento: string, tabla: string, document: any) {
    console.log(this.API_URL + rutaDocumento);
    return new Promise((resolve) => {
      this.http.post(this.API_URL + rutaDocumento + tabla, document).subscribe(
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

  validarPermisos(){
    this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((result)=> {
        if(!result.hasPermission){
          this.checkPermissions();
        }
      }),(err)=>{
        this.providerMensajes.ErrorMensajePersonalizado('Error al acceder a los permisos del telefono')
      }
  }

  checkPermissions(){
    this.androidPermissions.requestPermissions(
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    );
  }

}
