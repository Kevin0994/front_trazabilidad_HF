import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ProviderService } from 'src/provider/ApiRest/provider.service';
import { ProviderMensajes } from 'src/provider/modalMensaje/providerMessege.service';
import { ProviderMetodosCrud } from 'src/provider/methods/providerMetodosCrud.service';

@Component({
  selector: 'app-cosecha-historial',
  templateUrl: './cosecha-historial.page.html',
  styleUrls: ['./cosecha-historial.page.scss'],
})
export class CosechaHistorialPage implements OnInit {

  cosechaHistorial:any=[];
  historial:any;
  cosecha:any;

  constructor(private proveedor: ProviderService,
    private providerMensajes: ProviderMensajes,
    public alertController: AlertController,
    public navCtrl:NavController,
    public modalController:ModalController,) {

    }

  ngOnInit() {

  }

  ionViewWillEnter(){
   this.loadDatos();
  }

  loadDatos(){
    this.proveedor.obtenerDocumentos('cosechasHistorial/documents').then(data => {
      this.cosechaHistorial=data;
    }).catch(data => {
      console.log(data);
    })
  }


  async ValidarDelete(historial:any){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Seguro que desea elimar?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        }, {
          text: 'Si',
          handler: () => {

            var ingreso = historial.ingreso;
            var stock = historial.stock;
            var result =  stock - ingreso ;

            this.cosecha = {
              stock: result,
              idHis: historial.idHistorial,
              ingreso: historial.ingreso,
              fecha: historial.fecha,
              responsable: historial.responsable,
            }

            console.log(this.cosecha);
            this.proveedor.ActualizarCosechaHistorial('cosechaHistorial/delete/', historial.id,this.cosecha).then(data => {
              console.log(data);
              if (this.proveedor.status) {
                this.loadDatos();
                this.providerMensajes.MensajeDeleteServidor(this.alertController);
              } else {
                this.providerMensajes.ErrorMensajeServidor(this.alertController);
                return;
              }
            }).catch(data => {
              console.log(data);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
